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
const chatbot_1 = __importDefault(require("./chatbot/chatbot"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const zod_1 = require("./zod/zod");
const zodCheck_1 = require("./zod/zodCheck");
const encryption_1 = require("./encryption/encryption");
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
const port = process.env.PORT;
const hashSalt = parseInt(process.env.hashSalt || '10', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'Secret';
app.post('/api/v1/signin', (0, zodCheck_1.validateSchema)(zod_1.userSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const findUser = yield db_1.User.findOne({ email });
    if (findUser) {
        console.log("User Exists");
        return res.status(400).json({ error: 'User Exists' });
    }
    const salt = yield bcrypt_1.default.genSalt(hashSalt);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const user = new db_1.User({
        email,
        password: hashedPassword
    });
    user.save()
        .then(() => {
        console.log('User saved successfully');
    })
        .catch((error) => {
        console.error('Error saving user:', error);
    });
    const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET);
    res.status(200).json({ token });
}));
app.post('/api/v1/signup', (0, zodCheck_1.validateSchema)(zod_1.userSchema), authMiddleware_1.checkAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const findUser = yield db_1.User.findOne({ email });
    if (!findUser) {
        console.log("User Does not Exist");
        return res.status(400).json({ error: 'User Does not Exist' });
    }
    const isMatch = yield bcrypt_1.default.compare(password, findUser.password);
    if (!isMatch) {
        console.log("Wrong Password");
        return res.status(400).json({ error: 'Wrong Password' });
    }
    res.status(200).json({ message: 'Signedup successfully' });
}));
app.post('/api/v1/new', authMiddleware_1.checkAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const findUser = yield db_1.User.findOne({ email });
    const session = new db_1.ChatSession({
        userId: findUser === null || findUser === void 0 ? void 0 : findUser._id.toString()
    });
    yield session.save();
    return res.status(200).json({ session });
}));
app.post('/api/v1/chat', authMiddleware_1.checkAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = req.body.message;
    const sessionId = req.query.id;
    const { key, iv } = (0, encryption_1.generateKeyAndIv)(encryption_1.encryptionKeyLength, encryption_1.encryptionIvLength);
    const encryptedMessage = (0, encryption_1.encryptText)(message, key, iv);
    let chatMessage = new db_1.ChatMessage({
        chatSessionId: sessionId,
        sender: 'user',
        message: encryptedMessage,
        key: key.toString('hex'),
        iv: iv.toString('hex')
    });
    yield chatMessage.save();
    const answer = (0, chatbot_1.default)(message);
    const encryptedReply = (0, encryption_1.encryptText)(answer, key, iv);
    chatMessage = new db_1.ChatMessage({
        chatSessionId: sessionId,
        sender: 'system',
        message: encryptedReply,
        key: key.toString('hex'),
        iv: iv.toString('hex')
    });
    yield chatMessage.save();
    res.status(200).json({ answer });
}));
app.post('/api/v1/history', authMiddleware_1.checkAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    try {
        const findUser = yield db_1.User.findOne({ email });
        if (!findUser) {
            console.log("User Does Not Exist");
            return res.status(404).json({ error: 'User Does Not Exist' });
        }
        const id = findUser._id.toString();
        const history = yield db_1.ChatSession.find({ userId: id });
        if (history.length === 0) {
            return res.status(404).json({ message: 'No chat sessions found for the user.' });
        }
        const ids = history.map(item => item._id);
        const chats = yield db_1.ChatMessage.aggregate([
            { $match: { chatSessionId: { $in: ids } } },
            {
                $group: {
                    _id: "$chatSessionId",
                    message: { $first: "$message" },
                    key: { $first: "$key" },
                    iv: { $first: "$iv" },
                    sender: { $first: "$sender" },
                    timestamp: { $first: "$timestamp" }
                }
            }
        ]);
        if (chats.length > 0) {
            const decryptedMessages = chats.map(chat => {
                try {
                    const key = Buffer.from(chat.key, 'hex');
                    const iv = Buffer.from(chat.iv, 'hex');
                    return (0, encryption_1.decryptText)(chat.message, key, iv);
                }
                catch (error) {
                    console.error('Error decrypting message:', error);
                    return 'Error decrypting message';
                }
            });
            return res.status(200).json({ decryptedMessages });
        }
        else {
            return res.status(404).json({ message: 'No chat found for the given chatSessionId.' });
        }
    }
    catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}));
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
