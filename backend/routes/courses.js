const Task = require("../models/task");
const express = require("express");
const router = express.Router();

/**
 * Validate + sanitize input (no mass assignment)
 */
function sanitizeTaskInput(body) {
    if (!body || typeof body !== "object") {
        throw new TypeError("Invalid request body");
    }

    const sanitized = {};

    // Validate "task"
    if (Object.hasOwn(body, "task")) {
        if (typeof body.task !== "string" || body.task.trim() === "") {
            throw new TypeError("Invalid 'task' field");
        }
        sanitized.task = body.task.trim();
    }

    // Validate "completed"
    if (Object.hasOwn(body, "completed")) {
        if (typeof body.completed !== "boolean") {
            throw new TypeError("Invalid 'completed' field");
        }
        sanitized.completed = body.completed;
    }

    return sanitized;
}

/**
 * CREATE Task
 */
router.post("/", async (req, res) => {
    try {
        // Compliant Solution: Destructure ONLY permitted fields (S4684)
        const { task, completed } = req.body;
        
        // Pass sanitized fields explicitly to constructor
        const newTask = new Task({
            task: typeof task === "string" ? task.trim() : "",
            completed: typeof completed === "boolean" ? completed : false
        });

        await newTask.save();
        return res.status(201).json(newTask);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

/**
 * GET all tasks
 */
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find().lean();
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/**
 * UPDATE Task
 */
router.put("/:id", async (req, res) => {
    try {
        const existingTask = await Task.findById(req.params.id);

        if (!existingTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Compliant Solution: Destructure ONLY permitted fields (S4684)
        const { task, completed } = req.body;

        // Explicitly update only allowed fields
        if (typeof task === "string" && task.trim() !== "") {
            existingTask.task = task.trim();
        }

        if (typeof completed === "boolean") {
            existingTask.completed = completed;
        }

        await existingTask.save();
        return res.status(200).json(existingTask);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

/**
 * DELETE Task
 */
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
module.exports.sanitizeTaskInput = sanitizeTaskInput;