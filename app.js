const express = require("express");
const mongoose = require("mongoose");
const messagesRouter = require("./routes/messages");

const app = express();
app.use(express.json());

app.use("/api/messages", messagesRouter);

app.get("/", (req, res) => res.send("Chat API running"));

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/chat_message_demo";

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected");
        app.listen(3000, () => console.log("Server at http://localhost:3000"));
    })
    .catch((err) => {
        console.error("Mongo connect error:", err);
        process.exit(1);
    });
