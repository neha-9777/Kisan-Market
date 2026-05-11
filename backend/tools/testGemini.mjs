import { sendToGemini } from '../src/services/geminiService.js';

(async () => {
  try {
    console.log('Calling Gemini service...');
    const out = await sendToGemini([{ role: 'user', text: 'Hello, what can you do for farmers?' }]);
    console.log('Gemini output:\n', out);
  } catch (err) {
    console.error('Gemini test error:', err?.message || err);
    if (err?.stack) console.error(err.stack);
    process.exitCode = 1;
  }
})();
