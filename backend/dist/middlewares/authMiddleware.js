"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = checkAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Define your JWT secret or public key here (ideally store in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
// Middleware function to check if user is authenticated
function checkAuth(req, res, next) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Extract token from 'Bearer <token>'
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        // Attach user information to the request object
        // req.user = decoded; // Assuming the decoded token includes user information
        next();
    });
}
