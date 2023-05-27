const express = require('express');
const axios = require('axios');
const app = express();

app.post('/getChatResponse', async (req, res) => {
    const openaiResponse = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: req.body.prompt,
        max_tokens: 60
    }, {
        headers: {
            'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
        }
    });

    res.send(openaiResponse.data.choices[0].text.trim());
});

app.listen(3000, () => console.log('Server is running'));
