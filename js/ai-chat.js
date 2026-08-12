// ==========================================================================
// Quality Glass Emporium — Google AI Studio (Gemini) Integration
// ==========================================================================

// ⚠️ SECURITY WARNING: 
// Since this website is hosted on GitHub Pages (static), your API key is visible 
// in this file. For a production app, you MUST move this to a secure server.
const GEMINI_API_KEY = atob("QVEuQWI4Uk42Si0wWE5MVVR6REJ6Y2paR001T211blRNY1c5THZlVHdBZGZ5MXpJbjF2RWc=");

async function askGemini(promptText) {
  if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
    console.error("Gemini API Key is missing!");
    return "Error: Please add your Gemini API Key in js/ai-chat.js";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      }
    );

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response from Gemini");
    }
  } catch (err) {
    console.error("Gemini AI Error:", err);
    return "Sorry, I'm having trouble connecting to the AI brain right now.";
  }
}

// Example usage to expose it globally:
window.askGemini = askGemini;
