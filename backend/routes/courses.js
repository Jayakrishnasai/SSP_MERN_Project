const mongoose = require("mongoose");
const express = require("express");

const Task = require("../models/task");

const router = express.Router();

/**
 * Constants (Avoid magic numbers)
 */
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
};

const MAX_TASK_LENGTH = 120;

/**
 * Custom HTTP Error Class
 */
class HttpError extends TypeError {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Async Wrapper (Eliminates repetitive try-catch)
 */
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Sanitize & Validate Input
 */
function sanitizeTaskInput(body, options = {}) {
    const { requireTask = false } = options;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Invalid request body");
    }

    const sanitized = {};

    if (Object.hasOwn(body, "task")) {
        if (typeof body.task !== "string") {
            throw new HttpError(
                HTTP_STATUS.BAD_REQUEST,
                "The task field must be a string"
            );
        }

        const task = body.task.trim();

        if (!task) {
            throw new HttpError(
                HTTP_STATUS.BAD_REQUEST,
                "The task field cannot be empty"
            );
        }

        if (task.length > MAX_TASK_LENGTH) {
            throw new HttpError(
                HTTP_STATUS.BAD_REQUEST,
                `The task field must be <= ${MAX_TASK_LENGTH} characters`
            );
        }

        sanitized.task = task;
    } else if (requireTask) {
        throw new HttpError(
            HTTP_STATUS.BAD_REQUEST,
            "The task field is required"
        );
    }

    if (Object.hasOwn(body, "completed")) {
        if (typeof body.completed !== "boolean") {
            throw new HttpError(
                HTTP_STATUS.BAD_REQUEST,
                "The completed field must be a boolean"
            );
        }

        sanitized.completed = body.completed;
    }

    return sanitized;
}

/**
 * Validate Mongo ObjectId
 */
function validateObjectId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new HttpError(HTTP_STATUS.BAD_REQUEST, "Invalid task id");
    }
}

/**
 * ============================
 * ROUTES
 * ============================
 */

/**
 * Create Task
 */
router.post(
    "/",
    asyncHandler(async (req, res) => {
        const payload = sanitizeTaskInput(req.body, { requireTask: true });

        const newTask = await Task.create({
            task: payload.task,
            completed: payload.completed ?? false,
        });

        res.status(HTTP_STATUS.CREATED).json(newTask);
    })
);

/**
 * Get All Tasks
 */
router.get(
    "/",
    asyncHandler(async (_req, res) => {
        const tasks = await Task.find()
            .sort({ createdAt: -1 })
            .lean();

        res.status(HTTP_STATUS.OK).json(tasks);
    })
);

/**
 * Update Task
 */
router.put(
    "/:id",
    asyncHandler(async (req, res) => {
        validateObjectId(req.params.id);

        const payload = sanitizeTaskInput(req.body);

        if (Object.keys(payload).length === 0) {
            throw new HttpError(
                HTTP_STATUS.BAD_REQUEST,
                "At least one allowed field must be provided"
            );
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            payload,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedTask) {
            throw new HttpError(
                HTTP_STATUS.NOT_FOUND,
                "Task not found"
            );
        }

        res.status(HTTP_STATUS.OK).json(updatedTask);
    })
);

/**
 * Delete Task
 */
router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        validateObjectId(req.params.id);

        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            throw new HttpError(
                HTTP_STATUS.NOT_FOUND,
                "Task not found"
            );
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Task deleted successfully",
        });
    })
);

/**
 * ============================
 * EXPORTS
 * ============================
 */
module.exports = router;
module.exports.sanitizeTaskInput = sanitizeTaskInput;
module.exports.HttpError = HttpError;
