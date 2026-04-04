require("dotenv").config();
const courses = require("./routes/courses");
const connection = require("./db");
const cors = require("cors");
const express = require("express");
const app = express();

// Disable Express version fingerprint (S5689)
app.disable("x-powered-by");

connection();

app.use(express.json());

// Restrict CORS to known origins (S5122)
const allowedOrigins = new Set([
    process.env.FRONTEND_URL || "http://localhost",
    "http://localhost:3000",
    "http://localhost:80"
]);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.has(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    }
}));

app.use("/courses", courses);
const port = process.env.PORT || 3100;
app.listen(port, () => console.log(`Our backend api is listening via port ${port}`));
