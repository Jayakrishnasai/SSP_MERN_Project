jest.mock("axios", () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

describe("taskServices", () => {
    const originalEnv = process.env;

    afterEach(() => {
        process.env = originalEnv;
        jest.resetModules();
        jest.clearAllMocks();
    });

    test("uses the default courses endpoint", async () => {
        process.env = { ...originalEnv };
        jest.isolateModules(() => {
            const axios = require("axios");
            const services = require("./taskServices");

            services.getTasks();
            services.addTask({ task: "Learn AWS" });
            services.updateTask("123", { completed: true });
            services.deleteTask("123");

            expect(axios.get).toHaveBeenCalledWith("/courses");
            expect(axios.post).toHaveBeenCalledWith("/courses", {
                task: "Learn AWS",
            });
            expect(axios.put).toHaveBeenCalledWith("/courses/123", {
                completed: true,
            });
            expect(axios.delete).toHaveBeenCalledWith("/courses/123");
        });
    });

    test("uses REACT_APP_BACKEND_URL when provided", () => {
        process.env = {
            ...originalEnv,
            REACT_APP_BACKEND_URL: "https://api.example.com/tasks",
        };
        jest.isolateModules(() => {
            const axios = require("axios");
            const services = require("./taskServices");

            services.getTasks();

            expect(axios.get).toHaveBeenCalledWith(
                "https://api.example.com/tasks"
            );
        });
    });
});
