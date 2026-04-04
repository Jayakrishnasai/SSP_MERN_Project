const { sanitizeTaskInput } = require("../routes/courses");

// Test the sanitizeTaskInput function
describe("sanitizeTaskInput", () => {
    test("should return sanitized task field", () => {
        const result = sanitizeTaskInput({ task: "  Learn DevOps  " });
        expect(result.task).toBe("Learn DevOps");
    });

    test("should return sanitized completed field", () => {
        const result = sanitizeTaskInput({ completed: true });
        expect(result.completed).toBe(true);
    });

    test("should throw TypeError for invalid task type", () => {
        expect(() => sanitizeTaskInput({ task: 123 })).toThrow(TypeError);
    });

    test("should throw TypeError for empty task string", () => {
        expect(() => sanitizeTaskInput({ task: "   " })).toThrow(TypeError);
    });

    test("should throw TypeError for invalid completed type", () => {
        expect(() => sanitizeTaskInput({ completed: "yes" })).toThrow(TypeError);
    });

    test("should return empty object if no valid fields provided", () => {
        const result = sanitizeTaskInput({});
        expect(result).toEqual({});
    });
});
