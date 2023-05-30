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

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        }
      ],
    });

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
