import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.DB_URL || ""; // Replace with your MongoDB URI
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true,
});
const User = mongoose.model('User', userSchema);

const ChatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'completed', 'terminated'], default: 'active' },
});
const ChatSession = mongoose.model('ChatSession', ChatSessionSchema);

const ChatMessageSchema = new mongoose.Schema({
  chatSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true },
  sender: { type: String, enum: ['user', 'system'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);

export { User, ChatSession, ChatMessage };
