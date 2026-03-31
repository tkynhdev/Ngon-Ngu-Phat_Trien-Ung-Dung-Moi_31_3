const axios = require("axios");
const base = "http://localhost:3000/api/messages";

async function run() {
    console.log("Create text message...");
    await axios.post(base, {
        from: "userA",
        to: "userB",
        messageContent: { type: "text", text: "Xin chào userB" },
    });

    console.log("Create file message...");
    await axios.post(base, {
        from: "userB",
        to: "userA",
        messageContent: { type: "file", text: "C:\\images\\anh.jpg" },
    });

    console.log("\nGET /userB");
    const convo = await axios.get(`${base}/userB`, { params: { currentUser: "userA" } });
    console.log(convo.data);

    console.log("\nGET /last/all");
    const last = await axios.get(`${base}/last/all`, { params: { currentUser: "userA" } });
    console.log(last.data);
}

run().catch((e) => {
    console.error(e.response?.data || e.message);
    process.exit(1);
});
