import express from 'express'
import axios from 'axios'; 
import cors from 'cors';
import { config } from 'dotenv';
import { error } from 'console';
import { execa } from "execa";
import { exitCode } from 'process';

 

config(); 
const app = express();
const port = '8002';


app.use(cors());
app.use(express.json());
var prompt="";
var rcaid="";
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
     

    
      const { stdout } = await execa("sh " , ["aiops-script.sh "+ rcaid], { cwd: process.env.AIOPSSHPATH,shell:true } ); 
      console.log(stdout);

    } catch (error) {
        // console.log(error);
          res.status(500).json({ sendstatus: 0,
          errorcode: error.code,
          errorname: error.name,
          sendmessage: error.message  });
    }
    const data = {
      sendstatus: "1",
      sendmessage:"ansible script sent to ansible server for record : ["+rcaid+"]"
    };
    res.json(data);
    }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
