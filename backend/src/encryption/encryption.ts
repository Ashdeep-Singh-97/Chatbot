// utils.js
import crypto from 'crypto';

// Configuration for encryption
const encryptionAlgorithm = process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc';
const encryptionKeyLength = parseInt(process.env.ENCRYPTION_KEY_LENGTH || '32', 10);
const encryptionIvLength = parseInt(process.env.ENCRYPTION_IV_LENGTH || '16', 10);

// Generate a random key and IV
const generateKeyAndIv = (keyLength: number, ivLength: number) => {
    const key = crypto.randomBytes(keyLength); // Generate a random key
    const iv = crypto.randomBytes(ivLength); // Generate a random IV
    return { key, iv };
};

// Encrypt text
const encryptText = (text: string, key: crypto.CipherKey, iv: crypto.BinaryLike | null) => {
  const cipher = crypto.createCipheriv(encryptionAlgorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Decrypt text
const decryptText = (encryptedText: string, key: crypto.CipherKey, iv: crypto.BinaryLike | null) => {
  const decipher = crypto.createDecipheriv(encryptionAlgorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// Export the functions
export {
  generateKeyAndIv,
  encryptText,
  decryptText,
  encryptionKeyLength,
  encryptionIvLength
};
