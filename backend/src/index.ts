import getResponse from './chatbot/chatbot';
import express from 'express';
import dotenv from 'dotenv';
import { ChatMessage, ChatSession, User } from './db/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkAuth } from './middlewares/authMiddleware';
import { userSchema } from './zod/zod';
import { validateSchema } from './zod/zodCheck';
import { generateKeyAndIv, encryptText, decryptText, encryptionIvLength, encryptionKeyLength } from './encryption/encryption';
import cors from 'cors';

const app = express();
const corsOptions = {
  origin: 'https://chatbot-cfpo.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.options('/api/*', cors(corsOptions));
app.use(express.json());
dotenv.config();

const port = process.env.PORT;
const hashSalt = parseInt(process.env.hashSalt || '10', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'Secret';

app.post('/api/v1/signup', validateSchema(userSchema), async (req: any, res: any) => {
    const email = req.body.email;
    const password = req.body.password;

    const findUser = await User.findOne({ email });

    if (findUser) {
        console.log("User Exists");
        return res.status(400).json({ error: 'User Exists' });
    }
    const salt = await bcrypt.genSalt(hashSalt);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({
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
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(200).json({ token });
});

app.post('/api/v1/signin', validateSchema(userSchema), async (req: any, res: any) => {
    const email = req.body.email;
    const password = req.body.password;

    const findUser = await User.findOne({ email });

    if (!findUser) {
        console.log("User Does not Exist");
        return res.status(400).json({ error: 'User Does not Exist' });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);

    if (!isMatch) {
        console.log("Wrong Password");
        return res.status(400).json({ error: 'Wrong Password' });
    }

    const token = jwt.sign({ id: findUser._id }, JWT_SECRET);
    res.status(200).json({ token });
});

app.post('/api/v1/new', checkAuth, async (req: any, res: any) => {
    const email = req.body.email;

  try {
    // Find the user
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create and save a new chat session
    const session = new ChatSession({
      userId: findUser._id.toString()
    });
    await session.save();

    return res.status(200).json({ session });
  } catch (error) {
    console.error('Error creating new chat session:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.post('/api/v1/chat', checkAuth, async (req, res) => {
    const message = req.body.message;
    const sessionId = req.query.id;

    const { key, iv } = generateKeyAndIv(encryptionKeyLength, encryptionIvLength);
    const encryptedMessage = encryptText(message, key, iv);

    let chatMessage = new ChatMessage({
        chatSessionId: sessionId,
        sender: 'user',
        message: encryptedMessage,
        key: key.toString('hex'),
        iv: iv.toString('hex')
    });
    await chatMessage.save();
    const answer = await getResponse(message);

    const encryptedReply = encryptText(answer, key, iv);

    chatMessage = new ChatMessage({
        chatSessionId: sessionId,
        sender: 'system',
        message: encryptedReply,
        key: key.toString('hex'),
        iv: iv.toString('hex')
    });
    await chatMessage.save();

    res.status(200).json({ answer });
});

app.post('/api/v1/session', checkAuth, async (req, res) => {
    const sessionId = req.query.id;

    let chatMessage = await ChatMessage.find({ chatSessionId: sessionId });
    const decryptedMessages = chatMessage.map(msg => {
        // Convert key and iv from hex strings to Buffers
        const keyBuffer = Buffer.from(msg.key, 'hex');
        const ivBuffer = Buffer.from(msg.iv, 'hex');
  
        return {
          chatSessionId: msg.chatSessionId,
          sender: msg.sender,
          message: decryptText(msg.message, keyBuffer, ivBuffer), // Decrypt message with Buffer key and iv
          timestamp: msg.timestamp
        };
      });
  
    res.status(200).json({ decryptedMessages });
});

app.post('/api/v1/history', checkAuth, async (req, res) => {
    const email = req.body.email;

    try {
        const findUser = await User.findOne({ email });
        if (!findUser) {
            console.log("User Does Not Exist");
            return res.status(404).json({ error: 'User Does Not Exist' });
        }

        const id = findUser._id.toString();

        const history = await ChatSession.find({ userId: id });

        if (history.length === 0) {
            return res.status(404).json({ message: 'No chat sessions found for the user.' });
        }

        const ids = history.map(item => item._id);

        const chats = await ChatMessage.aggregate([
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
                    return {
                        chatSessionId: chat._id,
                        text: decryptText(chat.message, key, iv),
                        sender: chat.sender
                      };
                } catch (error) {
                    console.error('Error decrypting message:', error);
                    return 'Error decrypting message';
                }
            });
            return res.status(200).json({ decryptedMessages });
        } else {
            return res.status(404).json({ message: 'No chat found for the given chatSessionId.' });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
