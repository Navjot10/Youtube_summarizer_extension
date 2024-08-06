const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');
const app = express();
const PORT = 5002;

app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

app.post('/get_summary', async (req, res) => {
  try {
    const { transcript } = req.body;

    const completion = await openai.chat.completions.create({
    
        model: "gpt-4o-mini",
        messages: [{ role: 'user', content: `Summarize the following : ${transcript}` }],
        max_tokens: 1
    });

    const summary = completion.choices[0].message.content.trim();
    res.json({ summary });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Error fetching summary' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
