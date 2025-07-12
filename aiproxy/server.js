import express from 'express'
import axios from 'axios'; 
import cors from 'cors';
import { config } from 'dotenv';

config(); 
const app = express();
const port = '8002';

app.use(cors());
app.use(express.json());
var prompt="";
app.post('/api/generate', async (req, res) => {
  try {
    const apiKey ='AIzaSyBwHJbpEFvAKikUwTOM0pzTkeAtfK8Fn-8';
    prompt = req.body;
    //  console.log(prompt);
    // const data = prompt
    const data = {
      contents: [
        {
          parts: [
            {
              text: prompt.text,
            },
          ],
        },
      ],
    };

    const response = await axios({
      method: 'POST',
      // url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`,
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        key: apiKey,
      },
      data: data,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error generating response:' + error + '\n[prompt: '+ prompt +']' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
