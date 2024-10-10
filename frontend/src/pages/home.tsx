import React, { useState, useEffect } from 'react';
import {useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const MAX_TITLE_LENGTH = 30;

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || { email: 'Guest' };
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'system' }[]>([]);
  const [chatHistory, setChatHistory] = useState<{ chatSessionId: string; text: string; sender: 'user' | 'server' | 'system' }[]>([]);
  const [activeChat, setActiveChat] = useState("");
  const [creatingNewChat, setCreatingNewChat] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/'); // Redirect to login page if no token
    } else {
      fetchChatHistory();
    }
  }, [navigate]);

  useEffect(() => {
    if (activeChat) {
      fetchChatMessages();
    }
  }, [activeChat]);

  const fetchChatHistory = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No token found');

      const response = await axios.post(
        'http://localhost:3500/api/v1/history',
        { email: user.email },
        {
          headers: {
            'authorization': token
          }
        }
      );
      setChatHistory(response.data.decryptedMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const fetchChatMessages = async () => {
    if (!activeChat) return;

    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No token found');

      const response = await axios.post(
        `http://localhost:3500/api/v1/session?id=${encodeURIComponent(activeChat)}`,
        { email: user.email },
        {
          headers: {
            'authorization': token
          }
        }
      );
      const messagesData = response.data.decryptedMessages.map((msg: any) => ({
        text: msg.message,
        sender: msg.sender as 'user' | 'system',
        timestamp: msg.timestamp
      }));
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const handleSend = async () => {
    if (message.trim() === '') return;

    let currentChatId = activeChat;

    if (!currentChatId) {
      currentChatId = await handleNewChat();
      console.log(currentChatId);
      if (!currentChatId) {
        console.error('Failed to create new chat');
        return;
      }
      setActiveChat(currentChatId); // Ensure the state is updated
    }

    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No token found');
      console.log("ID before hitting chat endpoint in handlesend",currentChatId);
      const response = await axios.post(
        `http://localhost:3500/api/v1/chat?id=${encodeURIComponent(currentChatId)}`,
        { email: user.email, message: message },
        {
          headers: {
            'authorization': token
          }
        }
      );

      setMessages(prevMessages => [
        ...prevMessages,
        { text: message, sender: 'user' },
        { text: response.data.answer, sender: 'system' }
      ]);

      setMessage('');
      await fetchChatHistory();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleNewChat = async () => {
    if (creatingNewChat) return;

    setCreatingNewChat(true);

    try {
      const token = Cookies.get('token');
      if (!token) throw new Error('No token found');

      const response = await axios.post(
        'http://localhost:3500/api/v1/new',
        { email: user.email },
        {
          headers: {
            'authorization': token
          }
        }
      );

      const newSessionId = response.data.session._id;
      setActiveChat(newSessionId);
      await fetchChatHistory();
      return newSessionId;
    } catch (error) {
      console.error('Error creating new chat:', error);
    } finally {
      setCreatingNewChat(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token'); // Remove the token cookie
    navigate('/'); // Redirect to the home page or login page
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-clip" style={{ backgroundColor: '#ebe8e0' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 p-4 shadow-md" style={{ height: '100vh', overflowY: 'auto', backgroundColor: '#ebe8e0' }}>
        <button
          className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => window.location.reload()}
          disabled={creatingNewChat}
        >
          Start New Chat
        </button>
        <ul>
          {chatHistory.map(chat => (
            <li
              key={chat.chatSessionId}
              className={`cursor-pointer mb-2 p-2 rounded-lg ${activeChat === chat.chatSessionId ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
              onClick={() => setActiveChat(chat.chatSessionId)}
            >
              {chat.text.length > MAX_TITLE_LENGTH ? `${chat.text.substring(0, MAX_TITLE_LENGTH)}...` : chat.text}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: '#ebe8e0' }}>
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-300 via-blue-800 to-blue-600 text-white p-4 shadow-md rounded-xl">
          <div className="container mx-auto flex items-center">
            <div className="flex-1 flex justify-center">
              <h1 className="text-2xl font-bold">Welcome {user.email}</h1>
            </div>
            <button
              className="text-blue-200 hover:text-white ml-4 font-bold underline text-md"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 p-4 flex flex-col" >
          <div className="flex-1 bg-white p-4" style={{ backgroundColor: '#ebe8e0' }}>
            <div className="space-y-1">
              {messages.length === 0 ? (
                <p>No messages available.</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-3 rounded-lg text-white max-w-xs ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}
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
              onClick={handleSend}
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
