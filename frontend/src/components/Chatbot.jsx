import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Chatbot({ token }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef();
  const authToken = token || (JSON.parse(localStorage.getItem('user'))?.token);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    socketRef.current = io(BACKEND, { transports: ['websocket'] });
    socketRef.current.on('connect', () => console.log('connected', socketRef.current.id));
    socketRef.current.on('chat_message', (msg) => {
      setMessages((m) => [...m, msg]);
    });
    return () => socketRef.current.disconnect();
  }, []);

  async function send() {
    if (!text.trim()) return;
  try {
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      // Ensure there's a chat for this session (simple: create or use existing chat id stored locally)
      let chatId = localStorage.getItem('chatId');
      if (!chatId) {
        const r = await axios.post(`${BACKEND}/api/chat`, { title: 'Chat with AI' }, { headers });
        chatId = r.data._id;
        localStorage.setItem('chatId', chatId);
        // join the socket room for realtime events
        socketRef.current.emit('join', chatId);
      }

      const r = await axios.post(
        `${BACKEND}/api/chat/message`,
        { chatId, text },
        { headers }
      );

      // push user and ai messages
  const aiText = r.data.aiMessage?.text || '';
  setMessages((m) => [...m, { role: 'user', text }, { role: 'assistant', text: aiText }]);
  // notify other listeners via socket
  socketRef.current.emit('chat_message', { room: chatId, role: 'assistant', text: aiText });
      setText('');
    } catch (err) {
      console.error('Protected send failed', err?.message || err);
      const status = err?.response?.status;
      if (status === 401) {
        // Fallback to public guest send
        try {
          const pr = await axios.post(`${BACKEND}/api/chat/public/message`, { chatId, text });
          const aiText = pr.data.aiMessage?.text || '';
          const chatIdNew = pr.data.chatId;
          localStorage.setItem('chatId', chatIdNew);
          setMessages((m) => [...m, { role: 'user', text }, { role: 'assistant', text: aiText }]);
          socketRef.current.emit('join', chatIdNew);
          socketRef.current.emit('chat_message', { room: chatIdNew, role: 'assistant', text: aiText });
          setText('');
          return;
        } catch (pubErr) {
          console.error('Public send failed', pubErr);
          setMessages((m) => [...m, { role: 'assistant', text: "Unable to reach AI service." }]);
          return;
        }
      }
      setMessages((m) => [...m, { role: 'assistant', text: "Unable to reach AI service." }]);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white dark:bg-gray-900 rounded shadow text-gray-900 dark:text-white">
      <div className="h-96 overflow-y-auto p-2 space-y-3 bg-transparent">
        {messages.map((m, i) => {
          const bubbleClass = m.role === 'user'
            ? 'inline-block px-3 py-2 rounded bg-green-200 text-black'
            : 'inline-block px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white text-gray-800';

          return (
            <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <div className={bubbleClass}>
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={send}>Send</button>
      </div>
    </div>
  );
}
