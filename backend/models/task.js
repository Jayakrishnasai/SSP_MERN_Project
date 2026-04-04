const mongoose = require("mongoose");

const { Schema } = mongoose;

const taskSchema = new Schema(
    {
        task: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 120,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("Task", taskSchema);
