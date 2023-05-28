const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const cors = require('cors');
const app = express();
app.use(cors());

// OpenAI API key
const OPENAI_API_KEY = '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';

app.use(bodyParser.json());

app.post('/getChatResponse', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 60
      })
    });

    if (!response.ok) { // if HTTP-status is 200-299
      // get the error message from the body or default to response status
      const message = `An error has occured: ${response.status} ${await response.text()}`;
      throw new Error(message);
    }
    
    const data = await response.json();
    res.send(data.choices[0].text.trim());
  } catch (error) {
    console.error("Error in /getChatResponse:", error.message);
    res.status(500).json({ error: "Error processing request" });
}
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
