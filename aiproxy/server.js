import express from 'express'
import axios from 'axios'; 
import cors from 'cors';
import { config } from 'dotenv';
import { execa } from "execa";

config(); 
const app = express();
const port = process.env.aiporxyport || '8002';

// ===== Fixed CORS Section =====
// Allow all origins and handle preflight automatically
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET','POST','PUT','DELETE','OPTIONS'], // Include all HTTP methods your client may use
  allowedHeaders: ['Content-Type','Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

var prompt="";
var rcaid="";

// ===== Route: Generate content =====
app.post('/api/generate', async (req, res) => {
  try {
    const apiKey = process.env.geminiapiKey || 'AIzaSyBwHJbpEFvAKikUwTOM0pzTkeAtfK8Fn-8';
    const geminiurl = process.env.geminiUrl || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=';
    
    prompt = req.body;

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
      url: geminiurl + apiKey,
      headers: {
        'Content-Type': 'application/json',
      },
      params: { key: apiKey },
      data: data,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      status: 0,
      errorcode: error.code,
      errorname: error.name,
      error: error.message  
    });
  }
});

// ===== Route: Approve playbook =====
app.post('/api/approve', async (req, res) => {
  rcaid = req.body.rcaid;

  try {
    const { stdout } = await execa("sh", ["aiops-script.sh " + rcaid], { cwd: process.env.AIOPSSHPATH, shell:true }); 
    console.log(stdout);
  } catch (error) {
    res.status(500).json({ 
      sendstatus: 0,
      errorcode: error.code,
      errorname: error.name,
      sendmessage: error.message 
    });
    return;
  }

  const data = {
    sendstatus: "1",
    sendmessage: "Playbook has been sent to Ansible server for execution: [" + rcaid + "]"
  };
  res.json(data);
});

// ===== Route: Proxy /my-errors/open =====
app.get('/api/my-errors/open', async (req, res) => {
  try {
    // Forward the request to the real backend
    const response = await axios.get('https://aiproxy-aiops.apps.cluster-zhg5b.zhg5b.sandbox515.opentlc.com/my-errors/open', {
      headers: {
        // Forward auth headers if needed
        Authorization: req.headers.authorization || ''
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      status: 0,
      errorcode: error.code,
      errorname: error.name,
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
