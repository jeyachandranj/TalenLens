const express = require("express");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const { createServer } = require("http");
const Chatbot = require("./chatEngine.js");
const process = require("process");
const cors = require('cors')
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const AWS = require('aws-sdk');


dotenv.config();

const Groq = require('groq-sdk');

const app = express();

app.use(cors());
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const chatbot = new Chatbot("public" === "public");

app.use(express.static("dist"));

io.on("connection", (socket) => {
    console.log(`CONNECTED ${socket.id}`);

    socket.on("disconnect", (reason) => {
        console.log(`DISCONNECTED ${socket.id}: ${reason}`);
    });
    
    socket.on("init", async ({ settings, round ,name }) => {
        try {
            await chatbot.initialize(settings, round,name, socket.id); 
            socket.emit("responseInit", true);
            console.log(`INITIALIZED ${socket.id}`);
        } catch (err) {
            console.log(err);
            socket.emit("responseInit", false);
            console.log(`INIT FAILED ${socket.id}`);
        }
    });

    socket.on("message", async (data) => {
        try {
            console.log("Received data:", data);
    
            if (!data || typeof data.question !== "string") {
                throw new TypeError("The 'question' property must be a string.");
            }
            // let response;
            // console.log("Processing question:", data.question);
            // let isAIReplaied = true;
            // while(isAIReplaied)
            // {
            //   try{
            //    response = await chatbot.chat(data.question,data.duration,data.interviewStartTime,data.name);
            //    isAIReplaied = false;
            //   }
            //   catch{
            //     console.log("Ai replaied error");
            //   }
            // }
            const response = await chatbot.chat(data.question,data.duration,data.interviewStartTime,data.name);
            const speechData = await chatbot.textToSpeech(response);
    
            console.log(`RESPONSE (${socket.id}): ${response}`);
            console.log(`AUDIO (${socket.id}): ${speechData.audioFilePath}`);
    
            socket.emit("responseMessage", {
                response: response,
                speechData: speechData,
            });
        } catch (err) {
            console.error(`ERROR (${socket.id}):`, err.message);
    
            socket.emit("responseMessage", {
                response: "Sorry, I don't understand that.",
                speechData: null,
            });
        }
    });
    
});

app.get('/api/evaluateInterview', async (req, res) => {  
  const { interviewDuration: interviewDuration, name } = req.query;  

  if (!interviewDuration || !name) {  
      return res.status(400).json({ error: "interviewStartTime and name are required" });  
  }  

  const interviewProgress = await chatbot.evaluateInterviewProgress(interviewDuration, name);  
            
  return res.json(interviewProgress);  
});

const storage = multer.diskStorage({
    destination: path.join(__dirname, "public/temp"),
    filename: (req, file, cb) => {
      cb(null, "resume.pdf");
    },
  });
  
  const upload = multer({ storage });
  
  app.post("/upload", upload.single("resume"), (req, res) => {
    try {
      res.status(200).json({
        message: "File uploaded successfully",
        fileName: "resume.pdf", 
      });
    } catch (error) {
      res.status(500).json({
        message: "File upload failed",
        error,
      });
    }
  });


app.use(express.json());
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
});


const port = 3000;

// AWS S3 configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Configure Multer for file uploads
const storageaudio = multer.memoryStorage(); // Store files in memory
const audio = multer({ storage: storageaudio });

// Define the endpoint for audio file upload
app.post('/upload-audio', audio.single('audioFile'), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).send('No file uploaded.');
      }

      const { originalname, mimetype, buffer } = req.file; // Extract file properties
      const fileName = `${Date.now()}_${originalname}`; // Generate a unique file name

      // S3 upload parameters
      const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME, // Use the bucket name from .env
          Key: `audio/${fileName}`, // File path in S3
          Body: buffer, // The file buffer from multer
          ContentType: mimetype, // Set the content type dynamically
      };

      // Upload to S3
      const data = await s3.upload(uploadParams).promise();
      console.log(`File uploaded successfully. ${data.Location}`);

      // Return the URL of the uploaded file
      res.status(200).json({ url: data.Location });
  } catch (error) {
      console.error('Error uploading file to S3:', error);
      res.status(500).send('Error uploading file.');
  }
});


const userSchema = new mongoose.Schema({
  name: String,
  email:String,
  role: String,
  additionalInfo: String, // This can be either college name or last company name based on the role
});

const User = mongoose.model("User", userSchema);

// POST API to store the user data
app.post("/upload-resume", async (req, res) => {
  const { name , email, role, additionalInfo } = req.body;

  try {
    // Create a new user document in the database
    const newUser = new User({ name, email, role, additionalInfo });
    await newUser.save();

    res.status(200).json({ message: "Data saved successfully", user: newUser });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({ message: "Error saving data" });
  }
});

server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});


