import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    title: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    metadata: { type: Object },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
