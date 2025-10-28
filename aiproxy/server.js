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

// Allow all origins dynamically
app.use(cors({
  origin: '*',            // Allow all origins
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Handle preflight requests
app.options('*', cors());

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
