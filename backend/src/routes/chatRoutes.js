import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
	createChat,
	sendMessage,
	getChats,
	getMessages,
	publicCreateChat,
	publicSendMessage,
} from '../controllers/chatController.js';

const router = express.Router();

// Public guest endpoints (no auth)
router.post('/public', publicCreateChat);
router.post('/public/message', publicSendMessage);

// Protected endpoints
router.use(protect);
router.post('/', createChat);
router.get('/', getChats);
router.get('/:chatId/messages', getMessages);
router.post('/message', sendMessage);

export default router;
