"use strict";
// src/chatbot.ts
Object.defineProperty(exports, "__esModule", { value: true });
function getResponse(message) {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes('hello')) {
        return 'Hi there! How can I help you today?';
    }
    if (lowerCaseMessage.includes('how are you')) {
        return 'I am just a bot, but I am doing well. How about you?';
    }
    if (lowerCaseMessage.includes('bye')) {
        return 'Goodbye! Have a great day!';
    }
    return 'Sorry, I did not understand that. Can you please rephrase?';
}
exports.default = getResponse;
