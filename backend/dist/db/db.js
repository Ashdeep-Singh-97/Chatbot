"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = exports.ChatSession = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoURI = process.env.DB_URL || ""; // Replace with your MongoDB URI
mongoose_1.default.connect(mongoURI)
    .then(() => {
    console.log('Connected to the database');
})
    .catch((error) => {
    console.error('Error connecting to the database:', error);
});
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
});
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
const ChatSessionSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'completed', 'terminated'], default: 'active' },
});
const ChatSession = mongoose_1.default.model('ChatSession', ChatSessionSchema);
exports.ChatSession = ChatSession;
const ChatMessageSchema = new mongoose_1.default.Schema({
    chatSessionId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'ChatSession', required: true },
    sender: { type: String, enum: ['user', 'system'], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});
const ChatMessage = mongoose_1.default.model('ChatMessage', ChatMessageSchema);
exports.ChatMessage = ChatMessage;
