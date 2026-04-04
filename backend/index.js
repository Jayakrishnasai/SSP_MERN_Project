try {
    require("dotenv").config();
} catch (_error) {
    // dotenv is optional in production containers where env vars are injected externally.
}

const cors = require("cors");
const express = require("express");

const connectDB = require("./db");
const courses = require("./routes/courses");

const app = express();

app.disable("x-powered-by");

app.use(express.json({ limit: "16kb" }));

const allowedOrigins = new Set(
    [
        process.env.FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:80",
        "http://localhost",
    ].filter(Boolean)
);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.has(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Origin not allowed by CORS"));
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        optionsSuccessStatus: 204,
    })
);

app.get("/health", (_req, res) => {
    return res.status(200).json({ status: "ok" });
});

app.use("/courses", courses);

app.use((req, res) => {
    return res.status(404).json({ message: "Resource not found" });
});

app.use((error, _req, res, _next) => {
    if (error.message === "Origin not allowed by CORS") {
        return res.status(403).json({ message: "Forbidden" });
    }

    const statusCode = error.statusCode || 500;
    const safeMessage =
        statusCode >= 500 ? "Internal server error" : error.message;

    if (statusCode >= 500) {
        console.error("Unhandled backend error:", error);
    }

    return res.status(statusCode).json({ message: safeMessage });
});

const port = Number(process.env.PORT) || 3100;

async function startServer() {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Backend API listening on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start backend service:", error);
        process.exit(1);
    }
}

startServer();

module.exports = { app, allowedOrigins };
