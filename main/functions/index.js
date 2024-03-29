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
app.use(cors({ origin: 'https://referenta-30a27.web.app' }));
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: functions.config().openai.api_key,
});


const openai = new OpenAIApi(configuration);

app.options('*', cors());


app.post('/getChatResponse', async (req, res) => {
  let prompt = req.body.prompt;
  const maxTokens = req.body.maxTokens;
  const totalTokensNeeded = req.body.totalTokensNeeded;  // the total number of tokens you want to generate
  let attachedPdf = req.body.attachedPdf;

  let fullResponse = '';
  let totalTokensGenerated = 0;

  try {
    //while (totalTokensGenerated < totalTokensNeeded) {
      const response = await openai.createChatCompletion({
        model: 'gpt-4-0613',
        messages: [
          {
            role: 'user',
            content: prompt + "Input consideration: " + attachedPdf,
          }
        ],
        max_tokens: totalTokensNeeded*4,
        temperature: 0.4,

        /*functions: [
          {
              "name": "write-speech-in-german",
              "description": "Schreibe eine Rede auf deutsch, welche für den Deutschen Bundestag geeignet ist, die der Angabe der minimum Wörter entspricht und den tonalen parametern",
              "parameters": {
                "type": "object",
                "properties": {
                  "party": "Alternative für Deutschland",
                  "stil": "polemisch",
                  "typ": "parlamentarische rede",
                  "language": "German"
                },
                "required": ["language"]
              }
          }
        ],
        function_call: 'auto',*/

      });
      
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const botReply = response.data.choices[0].message.content.trim();
        fullResponse += botReply;
        totalTokensGenerated += countTokens(botReply);  
        prompt = "Task: Continue Speech -- " + "Already generated text: " + botReply;
      } else {
        throw new Error('Invalid response received from OpenAI API');
      }
    //}
    /*
    try{
      await openai.files.create({ file: fs.createReadStream('training_data.jsonl'), purpose: 'fine-tune' });
  
      const fineTune = await openai.fineTunes.create({ training_file: 'training_data.jsonl', model: 'gpt-3.5-turbo' })
      console.log(fineTune)
    }catch(error){
      console.error(error);
      throw error; // 
    }*/

    res.send(fullResponse);
  } catch (error) {
    console.error("Error in /getChatResponse:", error.message, error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/getFineTunedResponse', async (req, res) => {
  let prompt = req.body.prompt;
  const maxTokens = req.body.maxTokens;
  const totalTokensNeeded = req.body.totalTokensNeeded;  // the total number of tokens you want to generate
  let attachedPdf = req.body.attachedPdf;

  let fullResponse = '';
  let totalTokensGenerated = 0;

  try {
    while (totalTokensGenerated < totalTokensNeeded) {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo-16k-0613',
        messages: [
          {
            role: 'user',
            content: prompt + "Input consideration: " + attachedPdf,
          }
        ],
        max_tokens: totalTokensNeeded*4,
        temperature: 0.2,
        


        /*functions: [
          {
              "name": "write-speech-in-german",
              "description": "Schreibe eine Rede auf deutsch, welche für den Deutschen Bundestag geeignet ist, die der Angabe der minimum Wörter entspricht und den tonalen parametern",
              "parameters": {
                "type": "object",
                "properties": {
                  "party": "Alternative für Deutschland",
                  "stil": "polemisch",
                  "typ": "parlamentarische rede",
                  "language": "German"
                },
                "required": ["language"]
              }
          }
        ],
        function_call: 'auto',*/

      });
      
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const botReply = response.data.choices[0].message.content.trim();
        fullResponse += botReply;
        totalTokensGenerated += countTokens(botReply);  
        prompt = "Task: Continue Speech -- " + "Already generated text: " + botReply;
      } else {
        throw new Error('Invalid response received from OpenAI API');
      }
    }

    res.send(fullResponse);
  } catch (error) {
    console.error("Error in /getChatResponse:", error.message, error);
    res.status(500).json({ error: error.message });
  }
});


app.post('/createFineTuningJob', async (req, res) =>{
  try{
    await openai.files.create({ file: fs.createReadStream('training_data.jsonl'), purpose: 'fine-tune' });

    const fineTune = await openai.fineTunes.create({ training_file: 'training_data.jsonl', model: 'gpt-3.5-turbo' })
    console.log(fineTune)
    res.send(fineTune)
  }catch(error){
    console.error(error);
    throw error; // 
  }
})



exports.api = functions.https.onRequest(app);

function countTokens(text) {
  // This function splits the text into words and punctuation, and counts the number of parts.
  // Note that this is still an approximation and will not match OpenAI's token count exactly.
  let tokens = text.match(/[\wäöüßÄÖÜ]+|[^\w\s]/gi);
  return tokens ? tokens.length : 0;
}
