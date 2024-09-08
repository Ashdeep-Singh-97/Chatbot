import axios from 'axios';

// Your OpenAI API key
const API_KEY = process.env.API_KEY;
const API_URL = 'https://api.openai.com/v1/completions';

interface OpenAIResponse {
    choices: Array<{
        text: string;
    }>;
}

// Function to get response from OpenAI
export default  async function getResponse(message: string): Promise<string> {
    
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('balle balle')) {
        return 'Shava Shava';
    }

    try {
        const response = await axios.post<OpenAIResponse>(API_URL, {            model: 'text-davinci-003',  // You can use other models as well
            prompt: message,
            max_tokens: 150,  // Adjust as needed
            temperature: 0.7  // Adjust creativity level
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error fetching response from OpenAI:', error);
        return 'Sorry, there was an error processing your request. Please try again later.';
    }
}
