import getResponse from './chatbot/chatbot';
import express from 'express';
import dotenv from 'dotenv';
import {User} from './db/db'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkAuth } from './middlewares/authMiddleware';
import { userSchema } from './zod/zod';
import { z } from 'zod';
import { validateSchema } from './zod/zodCheck';

const app = express();
app.use(express.json());
dotenv.config();

const port = process.env.PORT;
const hashSalt = parseInt(process.env.hashSalt || '10', 10);

const JWT_SECRET = process.env.JWT_SECRET || 'Secret';

app.post('/api/v1/signin', validateSchema(userSchema), async (req: any, res: any) => {
    const email = req.body.email;
    const password = req.body.password;
    
    const findUser = await User.findOne({ email });

    if(findUser)
    {
        console.log("User Exists");
        return res.status(400).json({ error: 'User Exists' });
    }
    const salt = await bcrypt.genSalt(hashSalt);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        email,
        password:hashedPassword
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

app.post('/api/v1/signup', validateSchema(userSchema), checkAuth, async (req: any, res: any) => {
    const email = req.body.email;
    const password = req.body.password;

    const findUser = await User.findOne({ email });

    if(!findUser)
    {
        console.log("User Does not Exist");
        return res.status(400).json({ error: 'User Does not Exist' });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);

    if(!isMatch)
    {
        console.log("Wrong Password");
        return res.status(400).json({ error: 'Wrong Password' });
    }

    res.status(200).json({ message: 'Signedup successfully' });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
