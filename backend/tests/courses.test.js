jest.mock("../models/task", () => ({
    create: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));

const mongoose = require("mongoose");

const Task = require("../models/task");
const router = require("../routes/courses");
const { sanitizeTaskInput, HttpError } = router;

function getRouteHandler(method, path) {
    const layer = router.stack.find(
        (routeLayer) =>
            routeLayer.route &&
            routeLayer.route.path === path &&
            routeLayer.route.methods[method]
    );

    return layer.route.stack[0].handle;
}

function createResponse() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
}

async function invokeRoute(method, path, req = {}) {
    const res = createResponse();
    const next = jest.fn();

    await getRouteHandler(method, path)(req, res, next);

    return { res, next };
}

describe("sanitizeTaskInput", () => {
    test("returns sanitized task and completed fields", () => {
        const result = sanitizeTaskInput({
            task: "  Learn DevOps  ",
            completed: true,
        });

        expect(result).toEqual({
            task: "Learn DevOps",
            completed: true,
        });
    });

    test("throws a bad request error for invalid request bodies", () => {
        expect.assertions(3);

        try {
            sanitizeTaskInput(null);
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect(error.statusCode).toBe(400);
            expect(error.message).toBe("Invalid request body");
        }
    });

    test("throws when task is required but missing", () => {
        expect.assertions(2);

        try {
            sanitizeTaskInput({}, { requireTask: true });
        } catch (error) {
            expect(error.statusCode).toBe(400);
            expect(error.message).toBe("The task field is required");
        }
    });

    test("throws when the task exceeds the maximum length", () => {
        expect.assertions(2);

        try {
            sanitizeTaskInput({ task: "a".repeat(121) });
        } catch (error) {
            expect(error.statusCode).toBe(400);
            expect(error.message).toBe("The task field must be <= 120 characters");
        }
    });

    test("throws for invalid completed types", () => {
        expect.assertions(2);

        try {
            sanitizeTaskInput({ completed: "yes" });
        } catch (error) {
            expect(error.statusCode).toBe(400);
            expect(error.message).toBe("The completed field must be a boolean");
        }
    });
});

describe("courses routes", () => {
    const validObjectId = "507f1f77bcf86cd799439011";

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("creates a task and defaults completed to false", async () => {
        const createdTask = { _id: validObjectId, task: "Write tests", completed: false };
        Task.create.mockResolvedValue(createdTask);

        const { res, next } = await invokeRoute("post", "/", {
            body: { task: "  Write tests  " },
        });

        expect(Task.create).toHaveBeenCalledWith({
            task: "Write tests",
            completed: false,
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(createdTask);
        expect(next).not.toHaveBeenCalled();
    });

    test("lists all tasks in descending creation order", async () => {
        const tasks = [{ task: "Newest" }, { task: "Older" }];
        const lean = jest.fn().mockResolvedValue(tasks);
        const sort = jest.fn().mockReturnValue({ lean });

        Task.find.mockReturnValue({ sort });

        const { res, next } = await invokeRoute("get", "/", {});

        expect(Task.find).toHaveBeenCalledTimes(1);
        expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
        expect(lean).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(tasks);
        expect(next).not.toHaveBeenCalled();
    });

    test("rejects updates for invalid task ids", async () => {
        mongoose.Types.ObjectId.isValid.mockReturnValue(false);

        const { res, next } = await invokeRoute("put", "/:id", {
            params: { id: "invalid-id" },
            body: { task: "Update task" },
        });

        expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 400,
                message: "Invalid task id",
            })
        );
    });

    test("rejects updates with no allowed fields", async () => {
        const { next } = await invokeRoute("put", "/:id", {
            params: { id: validObjectId },
            body: {},
        });

        expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 400,
                message: "At least one allowed field must be provided",
            })
        );
    });

    test("returns not found when updating a missing task", async () => {
        Task.findByIdAndUpdate.mockResolvedValue(null);

        const { next } = await invokeRoute("put", "/:id", {
            params: { id: validObjectId },
            body: { completed: true },
        });

        expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
            validObjectId,
            { completed: true },
            {
                new: true,
                runValidators: true,
            }
        );
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 404,
                message: "Task not found",
            })
        );
    });

    test("updates and returns the task when input is valid", async () => {
        const updatedTask = { _id: validObjectId, task: "Ship coverage", completed: true };
        Task.findByIdAndUpdate.mockResolvedValue(updatedTask);

        const { res, next } = await invokeRoute("put", "/:id", {
            params: { id: validObjectId },
            body: { task: "  Ship coverage  ", completed: true },
        });

        expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
            validObjectId,
            { task: "Ship coverage", completed: true },
            {
                new: true,
                runValidators: true,
            }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedTask);
        expect(next).not.toHaveBeenCalled();
    });

    test("rejects deletes for invalid task ids", async () => {
        mongoose.Types.ObjectId.isValid.mockReturnValue(false);

        const { next } = await invokeRoute("delete", "/:id", {
            params: { id: "invalid-id" },
        });

        expect(Task.findByIdAndDelete).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 400,
                message: "Invalid task id",
            })
        );
    });

    test("returns not found when deleting a missing task", async () => {
        Task.findByIdAndDelete.mockResolvedValue(null);

        const { next } = await invokeRoute("delete", "/:id", {
            params: { id: validObjectId },
        });

        expect(Task.findByIdAndDelete).toHaveBeenCalledWith(validObjectId);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                statusCode: 404,
                message: "Task not found",
            })
        );
    });

    test("deletes a task and returns a success message", async () => {
        Task.findByIdAndDelete.mockResolvedValue({ _id: validObjectId });

        const { res, next } = await invokeRoute("delete", "/:id", {
            params: { id: validObjectId },
        });

        expect(Task.findByIdAndDelete).toHaveBeenCalledWith(validObjectId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Task deleted successfully",
        });
        expect(next).not.toHaveBeenCalled();
    });
});
