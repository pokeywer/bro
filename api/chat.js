// This file goes in a folder called "api" at the root of your repo, as "api/chat.js"
// Vercel automatically turns this into a live endpoint at: https://yoursite.vercel.app/api/chat
//
// Uses Google's Gemini API, which has a genuinely free tier (no credit card needed).
// Get a free key at: https://aistudio.google.com/apikey
// Then set GEMINI_API_KEY as an Environment Variable in your Vercel project settings.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: { message: 'Server is missing GEMINI_API_KEY. Add it in Vercel > Project Settings > Environment Variables.' }
    });
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      }
    );
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
}
