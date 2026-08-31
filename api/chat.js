// This file goes in a folder called "api" at the root of your repo, as "api/chat.js"
// Vercel automatically turns this into a live endpoint at: https://your-app.vercel.app

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'Server is missing GEMINI_API_KEY.' } });
  }

  try {
    const clientBody = req.body || {};

    // Lowest possible restrictions allowed for free tier accounts
    const freeTierSettings = [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_ONLY_HIGH" }
    ];

    // Build standard payload format expected by generateContent API
    const modifiedBody = {
      contents: clientBody.contents || [
        { parts: [{ text: clientBody.prompt || "Hello" }] }
      ],
      safetySettings: freeTierSettings,
      generationConfig: clientBody.generationConfig || {}
    };

    // Google Gemini REST API endpoint targeting a specific valid Flash model variation
    const response = await fetch(
      `https://googleapis.com{apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifiedBody)
      }
    );

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
}
