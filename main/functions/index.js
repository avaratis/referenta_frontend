/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: functions.config().openai.api_key,
});
const openai = new OpenAIApi(configuration);

app.post('/getChatResponse', async (req, res) => {
  const prompt = req.body.prompt;
  const maxTokens = req.body.maxTokens;

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

exports.api = functions.https.onRequest(app);
