const mongoose = require("mongoose");

function normalizeConnectionString(connectionString) {
    return connectionString.replace("://:@", "://");
}

module.exports = async function connectDB() {
    const rawConnectionString = process.env.DB_CONN_STR;

    if (!rawConnectionString) {
        throw new Error("DB_CONN_STR environment variable is required");
    }

    const connectionString = normalizeConnectionString(rawConnectionString);
    const connectionParams = {};
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const hasDBCredentials = Boolean(username && password);
    const useDBAuth =
        process.env.USE_DB_AUTH === "true" || hasDBCredentials;

    if (useDBAuth && hasDBCredentials) {
        connectionParams.user = username;
        connectionParams.pass = password;
        connectionParams.authSource = process.env.DB_AUTH_SOURCE || "admin";
    } else if (useDBAuth) {
        console.warn(
            "USE_DB_AUTH is enabled, but DB_USERNAME or DB_PASSWORD is missing. Connecting without MongoDB authentication."
        );
    }

    await mongoose.connect(connectionString, connectionParams);
    console.log("Connected to MongoDB successfully.");
};
