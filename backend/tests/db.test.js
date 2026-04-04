jest.mock("mongoose", () => ({
    connect: jest.fn(),
}));

const mongoose = require("mongoose");
const connectDB = require("../db");

describe("connectDB", () => {
    const originalEnv = process.env;
    const originalConsoleLog = console.log;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...originalEnv };
        console.log = jest.fn();
    });

    afterEach(() => {
        process.env = originalEnv;
        console.log = originalConsoleLog;
    });

    test("throws when DB_CONN_STR is missing", async () => {
        delete process.env.DB_CONN_STR;

        await expect(connectDB()).rejects.toThrow(
            "DB_CONN_STR environment variable is required"
        );
        expect(mongoose.connect).not.toHaveBeenCalled();
    });

    test("connects without auth when USE_DB_AUTH is not true", async () => {
        process.env.DB_CONN_STR = "mongodb://localhost:27017/test";
        process.env.USE_DB_AUTH = "false";

        await connectDB();

        expect(mongoose.connect).toHaveBeenCalledWith(
            "mongodb://localhost:27017/test",
            {}
        );
        expect(console.log).toHaveBeenCalledWith(
            "Connected to MongoDB successfully."
        );
    });

    test("connects with auth credentials when enabled", async () => {
        process.env.DB_CONN_STR = "mongodb://localhost:27017/test";
        process.env.USE_DB_AUTH = "true";
        process.env.DB_USERNAME = "admin";
        process.env.DB_PASSWORD = "secret";

        await connectDB();

        expect(mongoose.connect).toHaveBeenCalledWith(
            "mongodb://localhost:27017/test",
            {
                user: "admin",
                pass: "secret",
            }
        );
    });
});
