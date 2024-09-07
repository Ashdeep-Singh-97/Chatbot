import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; // Ensure you have this package installed

const MAX_TITLE_LENGTH = 30; // Define maximum length for chat title

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || { email: 'Guest' };
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'server' | 'system' }[]>([]);
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string }[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);


  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 p-4 shadow-md">
        <button className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Start New Chat
        </button>
        <ul>
          {chatHistory.map(chat => (
            <li
              key={chat.id}
              className={`cursor-pointer mb-2 p-2 rounded-lg ${activeChat === chat.id ? 'bg-blue-600 text-white' : 'bg-gray-300'
                }`}
            >
              {chat.title || 'No title'}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex items-center">
            <div className="flex-1 flex justify-center">
              <h1 className="text-2xl font-bold">Welcome {user.email}</h1>
            </div>
            <Link to="/" className="text-blue-200 hover:text-white ml-4">
              Logout
            </Link>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 p-4 flex flex-col">
          <div className="flex-1 overflow-auto bg-white rounded-lg shadow-md p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p>No messages available.</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-3 rounded-lg text-white max-w-xs ${msg.sender === 'user' ? 'bg-blue-500' : msg.sender === 'system' ? 'bg-green-500' : 'bg-gray-300 text-black'
                        }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="mt-4 flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg border-gray-300 shadow-sm"
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
