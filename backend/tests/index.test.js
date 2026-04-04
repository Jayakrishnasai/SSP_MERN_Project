function loadIndexModule({
    nodeEnv = "test",
    frontendUrl,
    port,
    connectDbImpl = jest.fn().mockResolvedValue(),
} = {}) {
    jest.resetModules();

    process.env.NODE_ENV = nodeEnv;

    if (frontendUrl === undefined) {
        delete process.env.FRONTEND_URL;
    } else {
        process.env.FRONTEND_URL = frontendUrl;
    }

    if (port === undefined) {
        delete process.env.PORT;
    } else {
        process.env.PORT = String(port);
    }

    const disable = jest.fn();
    const use = jest.fn();
    const get = jest.fn();
    const listen = jest.fn((listenPort, callback) => {
        if (callback) {
            callback();
        }

        return { port: listenPort };
    });

    const appMock = {
        disable,
        use,
        get,
        listen,
    };

    const expressMock = jest.fn(() => appMock);
    expressMock.json = jest.fn(() => "json-middleware");

    const corsMock = jest.fn((options) => ({
        name: "cors-middleware",
        options,
    }));

    const dotenvConfig = jest.fn();
    const coursesRouter = { name: "courses-router" };

    jest.doMock("express", () => expressMock);
    jest.doMock("cors", () => corsMock);
    jest.doMock("dotenv", () => ({ config: dotenvConfig }));
    jest.doMock("../db", () => connectDbImpl);
    jest.doMock("../routes/courses", () => coursesRouter);

    const indexModule = require("../index");

    return {
        ...indexModule,
        appMock,
        corsMock,
        coursesRouter,
        connectDbImpl,
        dotenvConfig,
        expressMock,
    };
}

function createResponse() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
}

describe("backend index", () => {
    const originalEnv = process.env;
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalProcessExit = process.exit;

    beforeEach(() => {
        process.env = { ...originalEnv };
        console.log = jest.fn();
        console.error = jest.fn();
        process.exit = jest.fn();
    });

    afterEach(() => {
        process.env = originalEnv;
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
        process.exit = originalProcessExit;
        jest.resetModules();
        jest.clearAllMocks();
        jest.unmock("express");
        jest.unmock("cors");
        jest.unmock("dotenv");
        jest.unmock("../db");
        jest.unmock("../routes/courses");
    });

    test("configures the app, allowed origins, and middleware", () => {
        const loaded = loadIndexModule({
            frontendUrl: "https://frontend.example.com",
            port: 4200,
        });

        expect(loaded.dotenvConfig).toHaveBeenCalledTimes(1);
        expect(loaded.expressMock.json).toHaveBeenCalledWith({ limit: "16kb" });
        expect(loaded.appMock.disable).toHaveBeenCalledWith("x-powered-by");
        expect(loaded.port).toBe(4200);
        expect(loaded.allowedOrigins.has("https://frontend.example.com")).toBe(
            true
        );
        expect(loaded.allowedOrigins.has("http://localhost:3000")).toBe(true);
        expect(loaded.appMock.use).toHaveBeenCalledWith(
            "json-middleware"
        );
        expect(loaded.appMock.use).toHaveBeenCalledWith(
            "/courses",
            loaded.coursesRouter
        );
    });

    test("registers health, not found, and error handlers", () => {
        const loaded = loadIndexModule();
        const healthHandler = loaded.appMock.get.mock.calls[0][1];
        const notFoundHandler = loaded.appMock.use.mock.calls[3][0];
        const errorHandler = loaded.appMock.use.mock.calls[4][0];

        const healthRes = createResponse();
        healthHandler({}, healthRes);
        expect(healthRes.status).toHaveBeenCalledWith(200);
        expect(healthRes.json).toHaveBeenCalledWith({ status: "ok" });

        const notFoundRes = createResponse();
        notFoundHandler({}, notFoundRes);
        expect(notFoundRes.status).toHaveBeenCalledWith(404);
        expect(notFoundRes.json).toHaveBeenCalledWith({
            message: "Resource not found",
        });

        const corsRes = createResponse();
        errorHandler(
            new Error("Origin not allowed by CORS"),
            {},
            corsRes,
            jest.fn()
        );
        expect(corsRes.status).toHaveBeenCalledWith(403);
        expect(corsRes.json).toHaveBeenCalledWith({ message: "Forbidden" });

        const clientRes = createResponse();
        errorHandler(
            { statusCode: 400, message: "Bad request" },
            {},
            clientRes,
            jest.fn()
        );
        expect(clientRes.status).toHaveBeenCalledWith(400);
        expect(clientRes.json).toHaveBeenCalledWith({
            message: "Bad request",
        });

        const serverRes = createResponse();
        errorHandler(new Error("Unexpected failure"), {}, serverRes, jest.fn());
        expect(serverRes.status).toHaveBeenCalledWith(500);
        expect(serverRes.json).toHaveBeenCalledWith({
            message: "Internal server error",
        });
        expect(console.error).toHaveBeenCalledWith(
            "Unhandled backend error:",
            expect.any(Error)
        );
    });

    test("accepts allowed origins and rejects unknown origins in cors config", () => {
        const loaded = loadIndexModule({
            frontendUrl: "https://frontend.example.com",
        });
        const corsOptions = loaded.corsMock.mock.calls[0][0];
        const allowedCallback = jest.fn();
        const blockedCallback = jest.fn();

        corsOptions.origin(undefined, allowedCallback);
        corsOptions.origin("https://frontend.example.com", allowedCallback);
        corsOptions.origin("https://blocked.example.com", blockedCallback);

        expect(allowedCallback).toHaveBeenNthCalledWith(1, null, true);
        expect(allowedCallback).toHaveBeenNthCalledWith(2, null, true);
        expect(blockedCallback).toHaveBeenCalledWith(expect.any(Error));
        expect(blockedCallback.mock.calls[0][0].message).toBe(
            "Origin not allowed by CORS"
        );
    });

    test("starts the server after connecting to the database", async () => {
        const connectDbImpl = jest.fn().mockResolvedValue();
        const loaded = loadIndexModule({
            connectDbImpl,
            port: 5000,
        });

        await loaded.startServer();

        expect(connectDbImpl).toHaveBeenCalledTimes(1);
        expect(loaded.appMock.listen).toHaveBeenCalledWith(
            5000,
            expect.any(Function)
        );
        expect(console.log).toHaveBeenCalledWith(
            "Backend API listening on port 5000"
        );
    });

    test("logs and exits when startup fails", async () => {
        const startupError = new Error("database unavailable");
        const connectDbImpl = jest.fn().mockRejectedValue(startupError);
        const loaded = loadIndexModule({ connectDbImpl });

        await loaded.startServer();

        expect(loaded.appMock.listen).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith(
            "Failed to start backend service:",
            startupError
        );
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    test("skips dotenv configuration in production", () => {
        const loaded = loadIndexModule({ nodeEnv: "production" });

        expect(loaded.dotenvConfig).not.toHaveBeenCalled();
    });
});
