require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/getChatResponse', async (req, res) => {
  const prompt = req.body.prompt;
  const maxTokens = req.body.maxTokens;

  try {
    const response = generateText(prompt, maxTokens);

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const botReply = response.data.choices[0].message.content.trim();
      res.send(botReply);
    } else {
      throw new Error('Invalid response received from OpenAI API');
    }
  } catch (error) {
    console.error("Error in /getChatResponse:", error.message, error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


async function generateText(prompt, minWords) {
  let text = "";
  let words = [];

  while (words.length < minWords) {
      const response = await openai.createCompletion({
          model: "ada",
          prompt: prompt,
          max_tokens: minWords, // A rough estimate: 5 tokens per word
      });

      text = response.data.choices[0].text.strip();
      console.log(text);
      words = text.split(' ');

      console.log(words.length)
      if (words.length < minWords) {
          prompt += text; // Append the previous output to the prompt
      }
  }

  return text;
}