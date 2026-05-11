import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['user', 'assistant', 'system'], default: 'user' },
    text: { type: String },
    markdown: { type: Boolean, default: false },
    attachments: [{ url: String, type: String }],
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
