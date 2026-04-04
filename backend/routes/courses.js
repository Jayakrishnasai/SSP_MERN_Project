const mongoose = require("mongoose");
const express = require("express");

const Task = require("../models/task");

const router = express.Router();

function createHttpError(statusCode, message) {
    const error = new TypeError(message);
    error.statusCode = statusCode;
    return error;
}

function sanitizeTaskInput(body, options = {}) {
    const { requireTask = false } = options;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw createHttpError(400, "Invalid request body");
    }

    const sanitized = {};

    if (Object.hasOwn(body, "task")) {
        if (typeof body.task !== "string") {
            throw createHttpError(400, "The task field must be a string");
        }

        const task = body.task.trim();

        if (!task) {
            throw createHttpError(400, "The task field cannot be empty");
        }

        if (task.length > 120) {
            throw createHttpError(400, "The task field must be 120 characters or fewer");
        }

        sanitized.task = task;
    } else if (requireTask) {
        throw createHttpError(400, "The task field is required");
    }

    if (Object.hasOwn(body, "completed")) {
        if (typeof body.completed !== "boolean") {
            throw createHttpError(400, "The completed field must be a boolean");
        }

        sanitized.completed = body.completed;
    }

    return sanitized;
}

function validateObjectId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createHttpError(400, "Invalid task id");
    }
}

router.post("/", async (req, res, next) => {
    try {
        const payload = sanitizeTaskInput(req.body, { requireTask: true });
        const newTask = await Task.create({
            task: payload.task,
            completed: payload.completed ?? false,
        });

        return res.status(201).json(newTask);
    } catch (error) {
        return next(error);
    }
});

router.get("/", async (_req, res, next) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 }).lean();
        return res.status(200).json(tasks);
    } catch (error) {
        return next(error);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        validateObjectId(req.params.id);

        const payload = sanitizeTaskInput(req.body);

        if (Object.keys(payload).length === 0) {
            throw createHttpError(400, "At least one allowed field must be provided");
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, payload, {
            new: true,
            runValidators: true,
        });

        if (!updatedTask) {
            throw createHttpError(404, "Task not found");
        }

        return res.status(200).json(updatedTask);
    } catch (error) {
        return next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        validateObjectId(req.params.id);

        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            throw createHttpError(404, "Task not found");
        }

        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
module.exports.sanitizeTaskInput = sanitizeTaskInput;
