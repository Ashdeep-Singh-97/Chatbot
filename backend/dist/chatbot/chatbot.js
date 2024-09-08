"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getResponse;
const axios_1 = __importDefault(require("axios"));
// Your OpenAI API key
const API_KEY = process.env.API_KEY;
const API_URL = 'https://api.openai.com/v1/completions';
// Function to get response from OpenAI
function getResponse(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const lowerCaseMessage = message.toLowerCase();
        if (lowerCaseMessage.includes('balle balle')) {
            return 'Shava Shava';
        }
        try {
            const response = yield axios_1.default.post(API_URL, { model: 'text-davinci-003', // You can use other models as well
                prompt: message,
                max_tokens: 150, // Adjust as needed
                temperature: 0.7 // Adjust creativity level
            }, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.choices[0].text.trim();
        }
        catch (error) {
            console.error('Error fetching response from OpenAI:', error);
            return 'Sorry, there was an error processing your request. Please try again later.';
        }
    });
}
