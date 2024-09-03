import getResponse from './chatbot/chatbot';

const port = 3000;
const express = require('express');
const app = express();
app.use(express.json());

app.post('/chat', (req: any, res: any) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }
    const botResponse = getResponse(userMessage);
    res.json({ response: botResponse });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
