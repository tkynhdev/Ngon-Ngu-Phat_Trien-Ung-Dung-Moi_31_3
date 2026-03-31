const express = require("express");
const Message = require("../models/Message");
const router = express.Router();

// GET /:userID -> chat 2 chiều
router.get("/:userID", async (req, res) => {
    try {
        const currentUser = req.query.currentUser;
        const userID = req.params.userID;
        if (!currentUser) {
            return res.status(400).json({ error: "Missing currentUser query" });
        }

        const messages = await Message.find({
            $or: [
                { from: currentUser, to: userID },
                { from: userID, to: currentUser },
            ],
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST / -> gửi tin
router.post("/", async (req, res) => {
    try {
        const currentUser = req.body.from || req.query.currentUser;
        const { to, messageContent } = req.body;

        if (!currentUser || !to || !messageContent || !messageContent.type || !messageContent.text) {
            return res.status(400).json({ error: "Missing fields" });
        }

        if (!["text", "file"].includes(messageContent.type)) {
            return res.status(400).json({ error: "messageContent.type must be text or file" });
        }

        const newMessage = new Message({
            from: currentUser,
            to,
            messageContent,
        });

        const saved = await newMessage.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /last/all -> tin cuối mỗi user tương tác
router.get("/last/all", async (req, res) => {
    try {
        const currentUser = req.query.currentUser;
        if (!currentUser) {
            return res.status(400).json({ error: "Missing currentUser query" });
        }

        const lastMessages = await Message.aggregate([
            { $match: { $or: [{ from: currentUser }, { to: currentUser }] } },
            {
                $project: {
                    otherUser: { $cond: [{ $eq: ["$from", currentUser] }, "$to", "$from"] },
                    from: 1,
                    to: 1,
                    messageContent: 1,
                    createdAt: 1,
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$otherUser",
                    lastMessage: { $first: "$$ROOT" },
                },
            },
            { $replaceRoot: { newRoot: "$lastMessage" } },
            { $sort: { createdAt: -1 } },
        ]);

        res.json(lastMessages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
