import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Check if API_KEY is present, else throw an error
if (!process.env.API_KEY) {
  throw new Error('API_KEY is not defined in the environment variables.');
}

const API_KEY = process.env.API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions'; // For GPT-3.5-turbo and GPT-4

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Function to get response from OpenAI
export default async function getResponse(message: string): Promise<string> {
  const lowerCaseMessage = message.toLowerCase();

  // Simple check for custom hardcoded responses
  if (lowerCaseMessage.includes('balle balle')) {
    return 'Shava Shava';
  }

  try {
    // Call OpenAI API
    const response = await axios.post<OpenAIResponse>(
      API_URL,
      {
        model: 'gpt-3.5-turbo',  // Use GPT-3.5-turbo or GPT-4 depending on your access
        messages: [{ role: 'user', content: message }],
        max_tokens: 150,            // Limit the response length
        temperature: 0.7            // Controls creativity (higher is more creative)
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Ensure the response structure is as expected
    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    } else {
      return 'No response from OpenAI.';
    }
  } catch (error: any) {
    // Log the error details for debugging
    console.error('Error fetching response from OpenAI:', error.response?.data || error.message);
    return 'Sorry, there was an error processing your request. Please try again later.';
  }
}
