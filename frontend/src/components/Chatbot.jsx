import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const API_BASE = '/api';

export default function Chatbot({ token }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [chatId, setChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const authToken = token || localStorage.getItem('token');

  // Initialize or load existing chat
  useEffect(() => {
    const initChat = async () => {
      const savedChatId = localStorage.getItem('currentChatId');
      if (savedChatId) {
        setChatId(savedChatId);
        await loadMessages(savedChatId);
      }
    };
    initChat();
  }, []);

  // Load previous messages for a chat
  const loadMessages = async (id) => {
    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const res = await axios.get(`${API_BASE}/chat/${id}/messages`, { headers });
      const msgs = res.data.map(m => ({ role: m.role, text: m.text }));
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  // Load chat history
  const loadChatHistory = async () => {
    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const res = await axios.get(`${API_BASE}/chat`, { headers });
      setChatHistory(res.data || []);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  useEffect(() => {
    if (authToken) {
      loadChatHistory();
    }
  }, [authToken]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createNewChat = async () => {
    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      let res;
      if (authToken) {
        res = await axios.post(`${API_BASE}/chat`, { title: `Chat ${new Date().toLocaleString()}` }, { headers });
      } else {
        res = await axios.post(`${API_BASE}/chat/public`, { title: 'Guest Chat' });
      }
      const newChatId = res.data._id || res.data.id;
      setChatId(newChatId);
      setMessages([]);
      localStorage.setItem('currentChatId', newChatId);
      await loadChatHistory();
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  };

  const clearChat = () => {
    if (confirm('Clear all messages in this chat?')) {
      setMessages([]);
    }
  };

  const selectChat = async (id) => {
    setChatId(id);
    await loadMessages(id);
    localStorage.setItem('currentChatId', id);
  };

  const send = async (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!text.trim()) return;

    const userText = text;
    setText('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      let newChatId = chatId;
      
      // Create chat if doesn't exist
      if (!newChatId) {
        await createNewChat();
        return; // Recursive call will happen after state update
      }

      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      
      try {
        // Try authenticated endpoint first
        if (authToken) {
          const res = await axios.post(
            `${API_BASE}/chat/message`,
            { chatId: newChatId, text: userText },
            { headers }
          );
          const aiText = res.data.aiMessage?.text || 'No response';
          setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
        } else {
          throw new Error('No auth');
        }
      } catch (authErr) {
        // Fallback to public endpoint
        try {
          const res = await axios.post(
            `${API_BASE}/chat/public/message`,
            { chatId: newChatId, text: userText }
          );
          const aiText = res.data.aiMessage?.text || 'No response';
          setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
        } catch (pubErr) {
          console.error('Both endpoints failed:', pubErr);
          setMessages(prev => [...prev, { role: 'assistant', text: '❌ Unable to reach AI service. Please try again.' }]);
        }
      }
    } catch (err) {
      console.error('Send failed:', err);
      setMessages(prev => [...prev, { role: 'assistant', text: '❌ Error sending message' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={createNewChat}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition"
          >
            + New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 px-2 py-2">Chat History</h3>
          {chatHistory.length === 0 ? (
            <p className="text-xs text-gray-500 px-2">No chats yet</p>
          ) : (
            chatHistory.map(chat => (
              <button
                key={chat._id}
                onClick={() => selectChat(chat._id)}
                className={`w-full text-left px-3 py-2 rounded text-sm truncate transition ${
                  chatId === chat._id
                    ? 'bg-green-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
                title={chat.title}
              >
                {chat.title || 'Untitled'}
              </button>
            ))
          )}
        </div>

        <div className="p-2 border-t border-gray-700">
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-full text-left px-2 py-1 text-xs text-gray-400 hover:text-white"
          >
            Hide
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-300 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-xl text-gray-700 hover:text-gray-900 mr-4"
          >
            ☰
          </button>
          <h1 className="text-lg font-bold text-gray-800">AI Chat Assistant</h1>
          <button
            onClick={clearChat}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
          >
            Clear
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-500 text-lg">Start a conversation with AI</p>
                <p className="text-gray-400 text-sm mt-2">Ask any question and get instant answers</p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <div
                  className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-gray-300 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <ReactMarkdown className="text-sm">{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="text-left">
              <div className="inline-block bg-gray-300 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white border-t border-gray-300 p-4">
          <form onSubmit={send} className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Type your question... (Enter to send)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 bg-white text-gray-900"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

