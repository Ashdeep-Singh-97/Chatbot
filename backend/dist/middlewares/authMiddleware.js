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
exports.checkAuth = checkAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
// Define your JWT secret or public key here (ideally store in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
// Middleware function to check if user is authenticated
function checkAuth(req, res, next) {
    var _a;
    const email = req.body.email;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Extract token from 'Bearer <token>'
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        try {
            const user = yield db_1.User.findOne({ email });
            const tokenUserId = decoded.id;
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (user._id.toString() !== tokenUserId) {
                return res.status(403).json({ error: 'User ID does not match' });
            }
        }
        catch (dbError) {
            console.error("Database error:", dbError); // Log the complete error
            return res.status(500).json({ error: 'Internal server error' });
        }
        next();
    }));
}
