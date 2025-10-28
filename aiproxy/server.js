import express from 'express'
import axios from 'axios'; 
import cors from 'cors';
import { config } from 'dotenv';
import { error } from 'console';
import { execa } from "execa";
import { exitCode } from 'process';

config(); 
const app = express();
const port = process.env.aiporxyport || '8002';

// ===== Fixed CORS Section =====
// Allow all origins dynamically and handle preflight requests
// Using both cors middleware and custom headers for debugging/preflight
app.use(cors({
  origin: '*',            // Allow all origins
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],  // Include all HTTP methods your client may use
  allowedHeaders: ['Content-Type','Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle OPTIONS preflight for all routes
app.options('*', cors());

// ===== Debug CORS Middleware (Optional) =====
// Ensures that Access-Control headers are always sent
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
var prompt="";
var rcaid="";

app.post('/api/generate', async (req, res) => {
  try {
    //process.env.geminiapiKey 
    //const apiKey ='AIzaSyBwHJbpEFvAKikUwTOM0pzTkeAtfK8Fn-8';
    const apiKey =  process.env.geminiapiKey  || 'AIzaSyBwHJbpEFvAKikUwTOM0pzTkeAtfK8Fn-8';
    const geminiurl =  process.env.geminiUrl  ||'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=';
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
     // url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey,
      url: geminiurl + apiKey,
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
    // console.log(error)
    res.status(500).json({ status: 0,
                           errorcode: error.code,
                           errorname: error.name,
                           error: error.message  });
  }
});

app.post('/api/approve', async (req, res) => {
    rcaid = req.body.rcaid;
    // console.log(rcaid); 
    // console.log(process.env.AIOPSSHPATH+ '/aiops-script.sh'); 
   
    //exceute bash script 
    
    try {
      const { stdout } = await execa("sh" , ["aiops-script.sh "+ rcaid], { cwd: process.env.AIOPSSHPATH, shell:true } ); 
      console.log(stdout);
    } catch (error) {
        // console.log(error);
          res.status(500).json({ sendstatus: 0,
          errorcode: error.code,
          errorname: error.name,
          sendmessage: error.message  });
          return;
    }
    const data = {
      sendstatus: "1",
      sendmessage:"Playbook has been sent to Ansible sever for execution: ["+rcaid+"]"
    };
    res.json(data);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
