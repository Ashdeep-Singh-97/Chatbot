"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatbot_1 = __importDefault(require("./chatbot/chatbot"));
const port = 3000;
const express = require('express');
const app = express();
app.use(express.json());
app.post('/chat', (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }
    const botResponse = (0, chatbot_1.default)(userMessage);
    res.json({ response: botResponse });
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
