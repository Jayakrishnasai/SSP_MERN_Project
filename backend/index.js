require("dotenv").config();
const courses = require("./routes/courses");
const connection = require("./db");
const cors = require("cors");
const express = require("express");

const app = express();
const port = process.env.PORT || 3100;

app.disable("x-powered-by");

connection();

app.use(express.json());

const allowedOrigins = new Set(
    [
        process.env.FRONTEND_URL,
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:80"
    ].filter(Boolean)
);

app.use(cors({
    origin(origin, callback) {
        if (!origin) {
            callback(null, true);
            return;
        }

        if (allowedOrigins.has(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("Not allowed by CORS"));
    }
}));

app.use("/courses", courses);

app.listen(port, () => console.log(`Our backend api is listening via port ${port}`));
