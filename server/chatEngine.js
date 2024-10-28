const sdk = require("microsoft-cognitiveservices-speech-sdk");
const dotenv = require("dotenv");
const { LocalStorage } = require("node-localstorage");
const path = require("path");
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();
const fs = require("fs");
const request = require("request");
const mongoose = require("mongoose");
const Groq = require("groq-sdk");

mongoose.connect("mongodb://localhost:27017/live-interview")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

const chatSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user_msg: { type: String, required: true },
    ai: { type: String, required: true },
    score: { type: Number },
    section: { type: String },
    duration: { type: Number, required: true },
});

const Chat = mongoose.model("Chat", chatSchema);

const MAX_INTERVIEW_DURATION = 300; // Total interview time in seconds (e.g., 30 minutes)
const STAGE_DURATION = 60; // Each stage duration in seconds (e.g., 5 minutes)
const PASSING_SCORE_THRESHOLD = 9; // Minimum average score to pass each stage
const NUMBER_OF_STAGES = Math.floor(MAX_INTERVIEW_DURATION / STAGE_DURATION);
const QUESTIONS_PER_STAGE = 5;


class Chatbot {
    constructor(public_path) {
        dotenv.config();
        this.socket_id = null;
        this.groq = new Groq({
            apiKey: "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",
        });

        if (public_path) {
            public_path = 'public';
        }

        this.groqHistory = [];
        this.messages = [];

        this.speechConfig = sdk.SpeechConfig.fromSubscription('093a6e33b5d546e3a622ccfc3cecf337', 'eastus');

        this.publicDir = path.join(process.cwd(), public_path);

        if (!fs.existsSync(this.publicDir + "/temp")) {
            fs.mkdirSync(this.publicDir + "/temp");
        }

        if (!fs.existsSync(this.publicDir + "/temp/audio")) {
            fs.mkdirSync(this.publicDir + "/temp/audio");
        }

        if (!fs.existsSync(this.publicDir + "/temp/chats")) {
            fs.mkdirSync(this.publicDir + "/temp/chats");
        }
    }

    async initialize(settings, socket_id) {
        this.settings = settings;
        this.socket_id = socket_id;

        this.speechConfig.speechSynthesisVoiceName = "en-US-RogerNeural";
        this.speechConfig.speechRecognitionLanguage = "en-US";
        this.audioFilePaths = [];

        this.speechAudioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
        this.speechRecognizer = new sdk.SpeechRecognizer(this.speechConfig, this.speechAudioConfig);
        const resumeText = await this.downloadResume();

        this.groqHistory = [];
        this.messages = [];
        let ai_content = " ";
        if (this.settings.resume === "skills") {
            ai_content = `You are a manager conducting a technical round of a job interview. Follow these rules: 1) Never reveal that you are an AI. 2) Provide logical answers based only on the resume and identity information; do not invent fake details. 3) Respond in the language used by the interviewer. 4) Answer in a human-like manner, avoiding technical jargon. 5) Ensure your answers are consistent with previous responses without repeating yourself. 6) Do not repeat yourself.7)Never ask the Interviewee to ask you questions.8)Start with Questions based on the given resume.9)Dont explain the answers everytime and move onto next question.10)Make note of how the interviewee performs and rate him when he asks about his performance.11)Ask 2 follow on questions maximum then move to other quesions.12)Ask questions mainly related to skills mentioned by the interviewee in the resume. Identity: Your name is Master , and you are hiring officer for a ${this.settings.job_title} position at ${this.settings.company_name}. The interviewee name is ${this.settings.interviewer_name}. From now on, answer in English and never mention that you are an AI. Here is the resume text to help you answer the questions: ${resumeText}`
        }
        else if (this.settings.resume === "project") {
            ai_content = `You are a manager conducting a technical round of a job interview. Follow these rules: 1) Never reveal that you are an AI. 2) Provide logical answers based only on the resume and identity information; do not invent fake details. 3) Respond in the language used by the interviewer. 4) Answer in a human-like manner, avoiding technical jargon. 5) Ensure your answers are consistent with previous responses without repeating yourself. 6) Do not repeat yourself.7)Never ask the Interviewee to ask you questions.8)Start with Questions based on the given resume.9)Dont explain the answers everytime and move onto next question.10)Make note of how the interviewee performs and rate him when he asks about his performance.11)Ask 2 follow on questions maximum then move to other quesions.12)Ask questions mainly related to projects mentioned by the interviewee in the resume. Identity: Your name is Master , and you are hiring officer for a ${this.settings.job_title} position at ${this.settings.company_name}. The interviewee name is ${this.settings.interviewer_name}. From now on, answer in English and never mention that you are an AI. Here is the resume text to help you answer the questions: ${resumeText}`
        }
        else if (this.settings.resume === "hr") {
            ai_content = `You are a manager conducting a technical round of a job interview. Follow these rules: 1) Never reveal that you are an AI. 2) Provide logical answers based only on the resume and identity information; do not invent fake details. 3) Respond in the language used by the interviewer. 4) Answer in a human-like manner, avoiding technical jargon. 5) Ensure your answers are consistent with previous responses without repeating yourself. 6) Do not repeat yourself.7)Never ask the Interviewee to ask you questions.8)Start with Questions based on the given resume.9)Dont explain the answers everytime and move onto next question.10)Make note of how the interviewee performs and rate him when he asks about his performance.11)Ask 2 follow on questions maximum then move to other quesions.12)Ask questions mainly related to personal details mentioned by the interviewee in the resume. Identity: Your name is Master , and you are hiring officer for a ${this.settings.job_title} position at ${this.settings.company_name}. The interviewee name is ${this.settings.interviewer_name}. From now on, answer in English and never mention that you are an AI. Here is the resume text to help you answer the questions: ${resumeText}`
        }
        else if (this.settings.resume === "all") {
            ai_content = `You are a manager conducting a technical round of a job interview. Follow these rules: 1) Never reveal that you are an AI. 2) Provide logical answers based only on the resume and identity information; do not invent fake details. 3) Respond in the language used by the interviewer. 4) Answer in a human-like manner, avoiding technical jargon. 5) Ensure your answers are consistent with previous responses without repeating yourself. 6) Do not repeat yourself.7)Never ask the Interviewee to ask you questions.8)Start with Questions based on the given resume.9)Dont explain the answers everytime and move onto next question.10)Make note of how the interviewee performs and rate him when he asks about his performance.11)Ask 2 follow on questions maximum then move to other quesions.12)Ask questions mainly related to skills mentioned by the interviewee in the resume. Identity: Your name is Master , and you are hiring officer for a ${this.settings.job_title} position at ${this.settings.company_name}. The interviewee name is ${this.settings.interviewer_name}. From now on, answer in English and never mention that you are an AI. Here is the resume text to help you answer the questions: ${resumeText}`
        }

        this.messages.push({
            role: "system",
            content: ai_content,
        });

        for (const [input_text, completion_text] of this.groqHistory) {
            this.messages.push({
                role: "user",
                content: input_text,
            });
            this.messages.push({
                role: "assistant",
                content: completion_text,
            });
        }
    }

    async downloadResume() {
        return new Promise((resolve, reject) => {
            let resume_text = "hi";
            request(this.settings.link_to_resume, { encoding: null }, (err, res, body) => {
                fs.writeFileSync(this.publicDir + "/temp/resume.pdf", body);
                const buffer = fs.readFileSync(this.publicDir + "/temp/resume.pdf");
                const options = {};
                pdfExtract.extractBuffer(buffer, options, (err, data) => {
                    if (err) return console.log(err);
                    let content_array = data.pages[0].content;
                    for (let i = 0; i < content_array.length; i++) {
                        resume_text += content_array[i].str + " ";
                    }
                    resolve(resume_text);
                    console.log("---------------------------------------------------------------------------------------")
                    console.log("resume text", resume_text);
                    console.log("---------------------------------------------------------------------------------------")
                    console.log("resume-title", this.settings);
                });
            });
        });
    }


    async determineScoreAndSection(previousUserMsg, previousAiResponse) {  
        const classificationPrompt = `  
            Based on the previous user message: "${previousUserMsg}",  
            and the previous AI response: "${previousAiResponse}",  
            please provide:  
            1. A score from 1 to 10 indicating the quality or relevance.  
            2. A section classification based on the content:   
               'general', 'skills', 'project', or 'experience'.  
               
            Format your response as JSON:  
            {  
                "score": <integer>,  
                "section": "general | skills | project | experience"  
            }`;  
    
        const scoreCompletion = await this.groq.chat.completions.create({  
            messages: [{ role: "system", content: classificationPrompt }],  
            model: "llama3-8b-8192",  
        });  
    
        if (scoreCompletion.choices && scoreCompletion.choices[0] && scoreCompletion.choices[0].message) {  
            const scoreResponse = scoreCompletion.choices[0].message.content;   
            let parsedScoreResponse;  
    
            try {  
                parsedScoreResponse = JSON.parse(scoreResponse);  
            } catch (error) {  
                console.error("Failed to parse score response:", scoreResponse);  
                throw new Error("Invalid score response format");  
            }  
    
            return parsedScoreResponse;  
        } else {  
            console.log("Invalid score completion format:", scoreCompletion);  
            throw new Error("Invalid score completion format");  
        }  
    }  
    

    

    async chat(userInput, duration, interviewStartTime, name) {
        this.messages.push({
            role: "user",
            content: userInput,
        });        


        const lastMessage = await Chat.findOne().sort({ createdAt: -1 }).lean();  

        let previousUserMsg = '';  
        let previousAiResponse = '';  

        if (lastMessage) {  
            previousUserMsg = lastMessage.user_msg;  
            previousAiResponse = lastMessage.ai;
        }  

        // const completion = await this.groq.chat.completions.create({
        //     messages: [
        //         ...this.messages,
        //         {
        //             role: "system",
        //             content: `Must give the response is bellow Json format as shown below please all responce is json format and also {} inside broket key and value bellow format :
        //                 {
        //                     "aiResponse": "<your response>",
        //                     "score": <integer between 0 and 10>,
        //                     "section": "<section type>"
        //                 }.
        //                 Ensure the JSON is valid and complete, without any additional text. section types include 'skill', 'project', 'experience', 'company', or 'general'. `
        //         }
        //     ],
        //     model: "llama3-8b-8192",
        // });
        const completion = await this.groq.chat.completions.create({
            messages: this.messages,
            model: "llama3-8b-8192",
        });

        const { score, section } = await this.determineScoreAndSection(previousUserMsg, previousAiResponse);  

        if (completion.choices && completion.choices[0] && completion.choices[0].message) {
            const aiResponse = completion.choices[0].message.content;



                // const aiMessage = completion.choices[0].message.content.trim();
                // const parsedResponse = JSON.parse(aiMessage);
                // console.log("response",parsedResponse)
                // const { aiResponse, score, section } = parsedResponse;
                const Username="Jeyachandran J";

                await Chat.create({
                    name: Username,
                    user_msg: userInput,
                    ai: aiResponse,
                    score,
                    section,
                    duration
                });

                // Store the assistant's response for the conversation history
                this.messages.push({
                    role: "assistant",
                    content: aiResponse,
                });

                await this.exportChat();

                return aiResponse;

           
        } else {
            console.log("Invalid completion format:", completion);
            throw new Error("Invalid completion format");
        }

    }

    

    

    async evaluateInterviewProgress(interviewDuration, name) {
        let scoreAvg = 0;
    
        let elapsedTime = interviewDuration;
        elapsedTime = Math.floor(elapsedTime / 1000);

        let completedStage;
        let currentStage;
        try {
            const results = await Chat.find({ name: name });
            const n = results.length;
            console.log("number",n);
    
            if (n === 0) {
                return { };
            }
    
            let totalScore = 0;
            let totalQuestions = 0; 
    
            for (let i = 0; i < n; i++) {
                totalScore += results[i].score;
                totalQuestions += 1;
            }
            scoreAvg = totalScore / n;
    
            completedStage = Math.floor(totalQuestions / QUESTIONS_PER_STAGE);
            
            currentStage = completedStage + 1; 
            currentStage = Math.min(currentStage, NUMBER_OF_STAGES); 
    
        } catch (error) {
            console.error("Error evaluating interview progress:", error);
            return res.status(500).json({ error: "An error occurred while evaluating the interview progress." });
        }
    
        let passed = scoreAvg >= PASSING_SCORE_THRESHOLD; 
    
        const interviewCompleted = (completedStage >= NUMBER_OF_STAGES);
    
        return {
            currentStage,   
            completedStage,          // The current stage the interviewee is in
            status: passed ? "pass" : "fail", // Overall pass/fail status based on average score
            interviewCompleted,       // Whether the interview has been fully completed
        };
    }
    

    
    
    


    async exportChat() {
        console.log("Exporting chat...");
        const chat = [];
        for (let i = 0; i < this.messages.length; i++) {
            if (this.messages[i].role == "user" || this.messages[i].role == "assistant") {
                chat.push({
                    role: this.messages[i].role,
                    content: this.messages[i].content,
                    audio: this.audioFilePaths[i],
                });
            }
        }
        const chat_path = path.join(this.publicDir, "temp/chats", `${this.socket_id}.json`);
        console.log(`Chat path: ${chat_path}`);

        let data = JSON.stringify(chat);

        console.log(`Writing to file: ${chat_path}`);
        await fs.writeFile(chat_path, data, (err) => {
            if (err) throw err;
            console.log("Chat saved to file.");
        });

        return chat_path;
    }


    async textToSpeech(text) {
        let visemes = [];

        const fileName = `${Math.random().toString(36).substring(7)}.wav`;
        const audioFilePath = path.join(__dirname, '..', 'client/public/temp', 'audio', fileName);
        console.log("path", audioFilePath);

        const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFilePath);

        const synthesizer = new sdk.SpeechSynthesizer(this.speechConfig, audioConfig);

        synthesizer.visemeReceived = (s, e) => {
            visemes.push({ visemeId: e.visemeId, audioOffset: e.audioOffset / 10000 });
        };

        const ssml = `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${this.speechConfig.speechSynthesisVoiceName}">${text}</voice></speak>`;

        await new Promise((resolve, reject) => {
            synthesizer.speakSsmlAsync(ssml, (result) => {
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    resolve();
                } else {
                    reject(result);
                }
            });
        });

        //store start time in db

        synthesizer.close();

        return { audioFilePath: audioFilePath, visemes: visemes };
    }

    async speechToText() {
        return new Promise((resolve, reject) => {
            try {
                console.log("[SYSTEM]: Speak into your microphone.");

                let text = "";
                this.speechRecognizer.recognized = (s, e) => {
                    try {
                        const res = e.result;
                        console.log(`recognized: ${res.text}`);
                    } catch (error) {
                        console.log(error);
                    }
                };

                this.speechRecognizer.sessionStarted = (s, e) => {
                    console.log(`SESSION STARTED: ${e.sessionId}`);
                };

                console.log("Starting recognition...");
                try {
                    this.speechRecognizer.recognizeOnceAsync(
                        (result) => {
                            console.log(`RECOGNIZED: Text=${result.text}`);
                            text = result.text;
                            resolve(text);
                        },
                        (error) => {
                            console.log(error);
                        }
                    );
                } catch (err) {
                    console.log(err);
                }

                process.stdin.on("keypress", (str, key) => {
                    if (key.name === "space") {
                        stopRecognition();
                    }
                });

                const stopRecognition = async () => {
                    try {
                        console.log("Stopping recognition...");
                        this.speechRecognizer.stopContinuousRecognitionAsync();
                        resolve(text);
                    } catch (error) {
                        console.log(error);
                    }
                };
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    async close() {
        console.log("Closing chatbot...");
        this.speechRecognizer.close();

        for (let i = 0; i < this.audioFilePaths.length; i++) {
            fs.unlinkSync(this.audioFilePaths[i]);
        }
    }
}

module.exports = Chatbot;