const mongoose = require("mongoose");

module.exports = async function connectDB() {
    const connectionString = process.env.DB_CONN_STR;

    if (!connectionString) {
        throw new Error("DB_CONN_STR environment variable is required");
    }

    const connectionParams = {};
    const useDBAuth = process.env.USE_DB_AUTH === "true";

    if (useDBAuth) {
        connectionParams.user = process.env.DB_USERNAME;
        connectionParams.pass = process.env.DB_PASSWORD;
    }

    await mongoose.connect(connectionString, connectionParams);
    console.log("Connected to MongoDB successfully.");
};
