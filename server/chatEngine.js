const sdk = require("microsoft-cognitiveservices-speech-sdk");
const dotenv = require("dotenv");
const { LocalStorage } = require("node-localstorage");
const path = require("path");
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();
const fs = require("fs");
const request = require("request");
const mongoose = require("mongoose");
const AWS = require('aws-sdk');
const FormData = require('form-data');
const axios = require('axios');


const Groq = require("groq-sdk");

let uri = "mongodb+srv://jeyachandranj:jj.jeyan@cluster0.pe8ib.mongodb.net/live-interview"

mongoose.connect(uri)
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

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});


const MAX_INTERVIEW_DURATION = 300;
const STAGE_DURATION = 60;
const PASSING_SCORE_THRESHOLD = 9;
const NUMBER_OF_STAGES = Math.floor(MAX_INTERVIEW_DURATION / STAGE_DURATION);
const QUESTIONS_PER_STAGE = 5;


class Chatbot {
    constructor(public_path) {
        dotenv.config();
        this.socket_id = null;
        this.apiKeys = [
            "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",
            "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",
            "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",
            "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",
            "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"
        ];

        this.currentIndex = 0;
        this.groq = this.initializeGroq();

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

    initializeGroq() {
        return new Groq({
            apiKey: this.apiKeys[this.currentIndex]
        });
    }

    async initialize( settings,round,name,filename,socket_id) {
        this.socket_id = socket_id;

        this.speechConfig.speechSynthesisVoiceName = "en-US-RogerNeural";
        this.speechConfig.speechRecognitionLanguage = "en-US";
        this.audioFilePaths = [];

        this.speechAudioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
        this.speechRecognizer = new sdk.SpeechRecognizer(this.speechConfig, this.speechAudioConfig);
        const resumeText = await this.downloadResume(filename);
        console.log(name+" *"+filename);
        this.groqHistory = [];
        this.messages = [];
        let ai_content = " ";
        if (round === "Technical") {
            ai_content = `You are a manager conducting a technical round of a job interview. Follow these rules: 1) Never reveal that you are an AI. 2) Provide logical answers based only on the resume and identity information; do not invent fake details. 3) Respond in the language used by the interviewer. 4) Answer in a human-like manner, avoiding technical jargon. 5) Ensure your answers are consistent with previous responses without repeating yourself. 6) Do not repeat yourself.7)Never ask the Interviewee to ask you questions.8)Start with Questions based on the given resume.9)Dont explain the answers everytime and move onto next question.10)Make note of how the interviewee performs and rate him when he asks about his performance.11)Ask 2 follow on questions maximum then move to other quesions.12)Ask questions mainly related to skills mentioned by the interviewee in the resume. Identity: Your name is Master , and you are hiring officer for a company and only question is technical related question. The interviewee name is ${name}. From now on, answer in English and never mention that you are an AI. Here is the resume text to help you answer the questions: ${resumeText}`
        }
        else if (round === "project") {
            ai_content = `You are a manager conducting a technical round of a job interview. Follow these rules: 1) Never reveal that you are an AI. 2) Provide logical answers based only on the resume and identity information; do not invent fake details. 3) Respond in the language used by the interviewer. 4) Answer in a human-like manner, avoiding technical jargon. 5) Ensure your answers are consistent with previous responses without repeating yourself. 6) Do not repeat yourself.7)Never ask the Interviewee to ask you questions.8)Start with Questions based on the given resume.9)Dont explain the answers everytime and move onto next question.10)Make note of how the interviewee performs and rate him when he asks about his performance.11)Ask 2 follow on questions maximum then move to other quesions.12)Ask questions mainly related to projects mentioned by the interviewee in the resume. Identity: Your name is Master , and you are hiring officer for a company and only question is project related question . The interviewee name is ${name}. From now on, answer in English and never mention that you are an AI. Here is the resume text to help you answer the questions: ${resumeText}`
        }
        else if (round === "hr") {
            ai_content = `You are a manager conducting a technical round of a job interview. Follow these rules: 1) Never reveal that you are an AI. 2) Provide logical answers based only on the resume and identity information; do not invent fake details. 3) Respond in the language used by the interviewer. 4) Answer in a human-like manner, avoiding technical jargon. 5) Ensure your answers are consistent with previous responses without repeating yourself. 6) Do not repeat yourself.7)Never ask the Interviewee to ask you questions.8)Start with Questions based on the given resume.9)Dont explain the answers everytime and move onto next question.10)Make note of how the interviewee performs and rate him when he asks about his performance.11)Ask 2 follow on questions maximum then move to other quesions.12)Ask questions mainly related to personal details mentioned by the interviewee in the resume. Identity: Your name is Master , and you are hiring officer company and only question is general . The interviewee name is ${name}. From now on, answer in English and never mention that you are an AI. Here is the resume text to help you answer the questions: ${resumeText}`
        }
        else {
            ai_content = `You are a manager conducting a technical round of a job interview. Follow these rules: 1) Never reveal that you are an AI. 2) Provide logical answers based only on the resume and identity information; do not invent fake details. 3) Respond in the language used by the interviewer. 4) Answer in a human-like manner, avoiding technical jargon. 5) Ensure your answers are consistent with previous responses without repeating yourself. 6) Do not repeat yourself.7)Never ask the Interviewee to ask you questions.8)Start with Questions based on the given resume.9)Dont explain the answers everytime and move onto next question.10)Make note of how the interviewee performs and rate him when he asks about his performance.11)Ask 2 follow on questions maximum then move to other quesions.12)Ask questions mainly related to skills mentioned by the interviewee in the resume. Identity: Your name is Master , and you are hiring officer for a  position at. The interviewee name is ${name}. From now on, answer in English and never mention that you are an AI. Here is the resume text to help you answer the questions: ${resumeText}`
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

    async downloadResume(filename) {
        return new Promise((resolve, reject) => {
            let resume_text = "hi";

            const resumePath = path.join(this.publicDir, "uploads", filename);

            if (!fs.existsSync(resumePath)) {
                reject("File not found: resume.pdf");
                return;
            }

            const buffer = fs.readFileSync(resumePath);
            const options = {};

            pdfExtract.extractBuffer(buffer, options, (err, data) => {
                if (err) {
                    console.error("Error extracting text from PDF:", err);
                    reject(err);
                    return;
                }

                const contentArray = data.pages[0].content;
                for (let i = 0; i < contentArray.length; i++) {
                    resume_text += contentArray[i].str + " ";
                }

                resolve(resume_text);
                console.log("---------------------------------------------------------------------------------------");
                console.log("Resume text:", resume_text);
                console.log("---------------------------------------------------------------------------------------");
            });
        });
    }


    async determineScoreAndSection(previousUserMsg, previousAiResponse) {
        const classificationPrompt = `
            Given the previous user message: "${previousUserMsg}",
            and the previous AI response: "${previousAiResponse}",
            please evaluate the following:
            1. Assign a score from 1 to 10 based on the quality or relevance of the response.
            2. Classify the content into one of these categories: 'general', 'skills', 'project', or 'experience'.
            Respond strictly in JSON format as follows:
            {
                "score": <numeric score>,
                "section": "<general | skills | project | experience>"
            }
        `;
        try {
            const scoreCompletion = await this.groq.chat.completions.create({
                messages: [{ role: "system", content: classificationPrompt }],
                model: "llama3-8b-8192",
            });
            if (scoreCompletion.choices && scoreCompletion.choices[0] && scoreCompletion.choices[0].message) {
                let scoreResponse = scoreCompletion.choices[0].message.content.trim();
                // Attempt to clean up the response if it has formatting issues
                scoreResponse = scoreResponse.replace(/[\(\)]/g, ''); // Remove any stray parentheses
                // Attempt to parse the JSON response
                try {
                    const parsedScoreResponse = JSON.parse(scoreResponse);
                    // Validate that the parsed response has expected structure
                    if (typeof parsedScoreResponse.score === 'number' &&
                        ['general', 'skills', 'project', 'experience'].includes(parsedScoreResponse.section)) {
                        return parsedScoreResponse;
                    } else {
                        throw new Error("Unexpected JSON structure");
                    }
                } catch (error) {
                    console.error("Failed to parse or validate score response:", scoreResponse);
                    throw new Error("Invalid score response format");
                }
            } else {
                console.log("Invalid score completion format:", scoreCompletion);
                throw new Error("Invalid score completion format");
            }
        } catch (error) {
            console.error("Error in determineScoreAndSection:", error);
            throw new Error("Failed to retrieve or parse score and section data");
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


        const completion = await this.groq.chat.completions.create({
            messages: this.messages,
            model: "llama3-8b-8192",
        });

        // const { score, section } = await this.determineScoreAndSection(previousUserMsg, previousAiResponse);
        const score = 7;
        const section  = 'general';


        if (completion.choices && completion.choices[0] && completion.choices[0].message) {
            const aiResponse = completion.choices[0].message.content;



                // const aiMessage = completion.choices[0].message.content.trim();
                // const parsedResponse = JSON.parse(aiMessage);
                // console.log("response",parsedResponse)
                // const { aiResponse, score, section } = parsedResponse;

                await Chat.create({
                    name: name,
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


    async storeAudioFile(text) {
        let visemes = [];
        const fileName = `${Math.random().toString(36).substring(7)}.wav`;
        const audioFilePath = path.join(__dirname,  'public/temp/audio', fileName);
        console.log("Audio file path:", audioFilePath);

        const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFilePath);
        const synthesizer = new sdk.SpeechSynthesizer(this.speechConfig, audioConfig);

        synthesizer.visemeReceived = (s, e) => {
            visemes.push({ visemeId: e.visemeId, audioOffset: e.audioOffset / 10000 });
        };

        const ssml = `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${this.speechConfig.speechSynthesisVoiceName}">${text}</voice></speak>`;

        return new Promise((resolve, reject) => {
            synthesizer.speakSsmlAsync(ssml, async (result) => {
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    synthesizer.close();
                    // Return the audio file path and visemes for further processing
                    resolve({ audioFilePath, visemes });
                } else {
                    reject(result);
                }
            });
        });
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async uploadAudioFile(audioFilePath) {
        let url = "";
        try {
            const formData = new FormData();
            formData.append('audioFile', fs.createReadStream(audioFilePath));

            // Send the POST request to your API
            const response = await axios.post('https://ai-interview-talenlens.onrender.com/upload-audio', formData, {
                headers: {
                    ...formData.getHeaders(), // Automatically set the necessary headers
                }
            });

            console.log('Upload response:', response.data);
            url = response.data.url;
        } catch (error) {
            console.error('Error uploading audio file:', error);
            throw new Error('Failed to upload audio file.');
        }

        return url;
    }

    async textToSpeech(text) {
        // First, create the audio file and retrieve its path and visemes
        const { audioFilePath, visemes } = await this.storeAudioFile(text);

        // Sleep for 100ms before uploading the audio file
        await this.sleep(50);

        // Now, upload the audio file
        const audioUrl = await this.uploadAudioFile(audioFilePath);

        // Return the final result including the uploaded URL and visemes
        return { audioFilePath:audioUrl, visemes:visemes};
    }




    // async textToSpeech(text) {
    //     let visemes = [];
    //     const fileName = `${Math.random().toString(36).substring(7)}.wav`;
    //     const localFilePath = path.join(__dirname, '..', 'client/public/temp', 'audio', fileName);
    //     const audioConfig = sdk.AudioConfig.fromAudioFileOutput(localFilePath);
    //     const synthesizer = new sdk.SpeechSynthesizer(this.speechConfig, audioConfig);

    //     synthesizer.visemeReceived = (s, e) => {
    //         visemes.push({ visemeId: e.visemeId, audioOffset: e.audioOffset / 10000 });
    //     };

    //     const ssml = `<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US"><voice name="${this.speechConfig.speechSynthesisVoiceName}">${text}</voice></speak>`;

    //     await new Promise((resolve, reject) => {
    //         synthesizer.speakSsmlAsync(ssml, (result) => {
    //             if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
    //                 resolve();
    //             } else {
    //                 reject(result);
    //             }
    //         });
    //     });

    //     synthesizer.close();

    //     const fileContent = fs.readFileSync(localFilePath);
    //     const s3Params = {
    //         Bucket: process.env.S3_BUCKET_NAME,
    //         Key: `audio/${fileName}`,
    //         Body: fileContent,
    //         ContentType: 'audio/mpeg',
    //         ACL: 'public-read',
    //     };

    //     const s3Result = await s3.upload(s3Params).promise();

    //     fs.unlinkSync(localFilePath);

    //     return { audioFilePath: s3Result.Location, visemes: visemes };
    //     // return { audioFilePath: localFilePath, visemes: visemes };

    // }

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
