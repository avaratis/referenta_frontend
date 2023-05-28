const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

import cors from 'cors';
const app = express();
app.use(cors());

// OpenAI API key
const OPENAI_API_KEY = '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';

app.use(bodyParser.json());

app.post('/getChatResponse', async (req, res) => {
  const prompt = req.body.prompt;

  const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sk-uAMWxx1LoyzEnAUXHe00T3BlbkFJDcggpo4JhQERYpy76i8ucd }`
    },
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: 60
    })
  });

  const data = await response.json();

  res.send(data.choices[0].text.trim());
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
