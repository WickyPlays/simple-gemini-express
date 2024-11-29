const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require('cors');
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/generate-prompt", async (req, res) => {
  const userInput = req.body.text

  if (!userInput) {
    return res.status(400).json({
      success: false,
      message: "Please provide a prompt.",
    });
  }

  try {
    // Make POST request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_TOKEN}`,
      {
        contents: [
          {
            parts: [
              {
                text: userInput,
              },
            ],
          },
        ],
      }
    );

    const resultText =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No content received";

    res.status(200).json({
      success: true,
      message: resultText,
    });
  } catch (error) {
    console.error("Error while generating content:", error.message);

    // Respond with error
    res.status(500).json({
      success: false,
      message: "Failed to generate content. Please try again.",
    });
  }
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//Ping itself every 5 minutes
setInterval(async () => {
  try {
    await axios.get(process.env.HOSTNAME);
  } catch (error) {
    console.error("Error calling /ping endpoint:", error.message);
  }
}, 5 * 60 * 1000);
