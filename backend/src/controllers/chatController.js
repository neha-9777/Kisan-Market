import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import { sendToGemini } from '../services/geminiService.js';

export async function createChat(req, res) {
  const userId = req.user._id;
  const { title, members } = req.body;
  const chat = await Chat.create({ title, members: [userId, ...(members || [])], createdBy: userId });
  res.status(201).json(chat);
}

// Public guest chat creation (no auth required)
export async function publicCreateChat(req, res) {
  const { title } = req.body;
  const chat = await Chat.create({ title: title || 'Guest Chat', members: [], metadata: { guest: true } });
  res.status(201).json(chat);
}

export async function sendMessage(req, res) {
  try {
    const userId = req.user._id;
    const { chatId, text } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Save user message
    const userMessage = await Message.create({ chat: chat._id, sender: userId, role: 'user', text });

    // Build messages history (last N) for context
    const recent = await Message.find({ chat: chat._id }).sort({ createdAt: 1 }).limit(40).lean();
    const geminiInput = recent.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', text: m.text }));

    // Call Gemini
    let aiText = '';
    try {
      aiText = await sendToGemini(geminiInput);
    } catch (err) {
      console.error('Gemini error', err.message);
      aiText = "I'm having trouble connecting to the AI service right now.";
    }

    const aiMessage = await Message.create({ chat: chat._id, role: 'assistant', text: aiText });

    res.json({ userMessage, aiMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

export async function getChats(req, res) {
  const userId = req.user._id;
  const chats = await Chat.find({ members: userId }).sort({ updatedAt: -1 }).limit(100);
  res.json(chats);
}

export async function getMessages(req, res) {
  const { chatId } = req.params;
  const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 });
  res.json(messages);
}

// Public send message (guest mode) - no user id
export async function publicSendMessage(req, res) {
  try {
    const { chatId, text } = req.body;
    let chat = chatId ? await Chat.findById(chatId) : null;
    if (!chat) {
      chat = await Chat.create({ title: 'Guest Chat', members: [], metadata: { guest: true } });
    }

    const userMessage = await Message.create({ chat: chat._id, role: 'user', text });

    // Build recent messages
    const recent = await Message.find({ chat: chat._id }).sort({ createdAt: 1 }).limit(40).lean();
    const geminiInput = recent.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', text: m.text }));

    let aiText = '';
    try {
      aiText = await sendToGemini(geminiInput);
    } catch (err) {
      console.error('Gemini error', err.message);
      aiText = "I'm having trouble connecting to the AI service right now.";
    }

    const aiMessage = await Message.create({ chat: chat._id, role: 'assistant', text: aiText });
    res.json({ chatId: chat._id, userMessage, aiMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
