const express = require("express");
const router = express.Router();


const chatCtrl = require("../controllers/chat_logController");


router.post("/add_chat", chatCtrl.addChat);  // Add a new message to the chat
router.get("/chat_logs/:user_id", chatCtrl.getAllChatsByUser_id);










module.exports = router;