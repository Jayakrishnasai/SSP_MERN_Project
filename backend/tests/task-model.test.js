const Task = require("../models/task");

describe("Task model", () => {
    test("defines the expected schema fields", () => {
        expect(Task.modelName).toBe("Task");
        expect(Task.schema.path("task").instance).toBe("String");
        expect(Task.schema.path("task").isRequired).toBe(true);
        expect(Task.schema.path("task").options.trim).toBe(true);
        expect(Task.schema.path("task").options.maxlength).toBe(120);
        expect(Task.schema.path("completed").instance).toBe("Boolean");
        expect(Task.schema.path("completed").defaultValue).toBe(false);
    });
});
