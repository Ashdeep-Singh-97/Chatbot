"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptionIvLength = exports.encryptionKeyLength = exports.decryptText = exports.encryptText = exports.generateKeyAndIv = void 0;
// utils.js
const crypto_1 = __importDefault(require("crypto"));
// Configuration for encryption
const encryptionAlgorithm = process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc';
const encryptionKeyLength = parseInt(process.env.ENCRYPTION_KEY_LENGTH || '32', 10);
exports.encryptionKeyLength = encryptionKeyLength;
const encryptionIvLength = parseInt(process.env.ENCRYPTION_IV_LENGTH || '16', 10);
exports.encryptionIvLength = encryptionIvLength;
// Generate a random key and IV
const generateKeyAndIv = (keyLength, ivLength) => {
    const key = crypto_1.default.randomBytes(keyLength); // Generate a random key
    const iv = crypto_1.default.randomBytes(ivLength); // Generate a random IV
    return { key, iv };
};
exports.generateKeyAndIv = generateKeyAndIv;
// Encrypt text
const encryptText = (text, key, iv) => {
    const cipher = crypto_1.default.createCipheriv(encryptionAlgorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};
exports.encryptText = encryptText;
// Decrypt text
const decryptText = (encryptedText, key, iv) => {
    const decipher = crypto_1.default.createDecipheriv(encryptionAlgorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptText = decryptText;
