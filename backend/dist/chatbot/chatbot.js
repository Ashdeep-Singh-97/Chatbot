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
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Check if API_KEY is present, else throw an error
if (!process.env.API_KEY) {
    throw new Error('API_KEY is not defined in the environment variables.');
}
const API_KEY = process.env.API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions'; // For GPT-3.5-turbo and GPT-4
// Function to get response from OpenAI
function getResponse(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const lowerCaseMessage = message.toLowerCase();
        // Simple check for custom hardcoded responses
        if (lowerCaseMessage.includes('balle balle')) {
            return 'Shava Shava';
        }
        try {
            // Call OpenAI API
            const response = yield axios_1.default.post(API_URL, {
                model: 'gpt-3.5-turbo', // Use GPT-3.5-turbo or GPT-4 depending on your access
                messages: [{ role: 'user', content: message }],
                max_tokens: 150, // Limit the response length
                temperature: 0.7 // Controls creativity (higher is more creative)
            }, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            // Ensure the response structure is as expected
            if (response.data.choices && response.data.choices.length > 0) {
                return response.data.choices[0].message.content.trim();
            }
            else {
                return 'No response from OpenAI.';
            }
        }
        catch (error) {
            // Log the error details for debugging
            console.error('Error fetching response from OpenAI:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            return 'Sorry, there was an error processing your request. Please try again later.';
        }
    });
}
