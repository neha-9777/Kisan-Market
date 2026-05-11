import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export default function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, {
    expiresIn: '7d',
  });
}
