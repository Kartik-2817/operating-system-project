import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static("."));

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  const prompt = `
  You are an expert Operating Systems tutor chatbot.
  Answer this student's OS question clearly and accurately:
  ${message}
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // ✅ double-check this model name
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    // ✅ Log the full response to debug
    console.log("Groq raw response:", JSON.stringify(data, null, 2));

    // ✅ Defensive check
    if (!data.choices || !data.choices[0]) {
      return res.json({
        reply: data.error?.message || "⚠️ No valid response from AI (check key or model name).",
      });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("❌ Groq API Error:", err);
    res.status(500).json({ reply: "Error connecting to AI." });
  }
});

app.listen(5000, () => console.log("✅ Server running at http://localhost:5000"));
