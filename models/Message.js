const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    messageContent: {
        type: {
            type: String,
            enum: ["text", "file"],
            required: true,
        },
        text: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
