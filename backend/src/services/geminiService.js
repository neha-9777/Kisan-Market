import fetch from 'node-fetch';
import config from '../config/env.js';

const GEMINI_BASE = 'https://api.generative.googleapis.com/v1beta2/models';
const DEFAULT_MODEL = 'gemini-small';

export async function sendToGemini(messages = []) {
  if (!config.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not configured — using fallback response');
    return "I'm unable to reach the AI service right now, but I can still try to help. Please try again later or login for full AI features.";
  }

  // Construct a simple prompt from messages
  const prompt = messages.map(m => `${m.role}: ${m.text}`).join('\n');

  const url = `${GEMINI_BASE}/${DEFAULT_MODEL}:generateMessage?key=${config.GEMINI_API_KEY}`;

  const body = {
    prompt: {
      text: prompt,
    },
    // temperature and candidate count can be tuned
    temperature: 0.7,
    maxOutputTokens: 500,
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error('Gemini API returned non-OK:', res.status, txt);
      return "I'm unable to reach the AI service right now. Please try again later.";
    }

    const data = await res.json();
    // Data shape may vary; try to extract sensible text
    const candidates = data?.candidates || [];
    const text = candidates.map(c => c?.content?.[0]?.text || c?.output?.[0]?.content || '').join('\n').trim();
    return text || data?.message || JSON.stringify(data);
  } catch (err) {
    console.error('Gemini fetch error:', err?.message || err, err?.stack || 'no-stack');
    return "I'm unable to reach the AI service right now. Please try again later.";
  }
}
