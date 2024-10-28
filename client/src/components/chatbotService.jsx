import { io } from "socket.io-client";

class ChatbotService {
	constructor() {
		// Production
		//this.socket = io();

		// Development
		//  this.socket = io("https://ai-interview-71dz.onrender.com");
		 this.socket = io("http://localhost:3000");

	}

	async init(settings) {
		this.socket.emit("init", settings);

		let response = await new Promise((resolve, reject) => {
			this.socket.on("responseInit", (response) => {
				if (response) {
					resolve(response);
				} else {
					reject(response);
				}
			});
		});

		return response;
	}

	async sendMessage(message) {
		const StartTime = localStorage.getItem('questionStartTime');
		const interviewStartTime = localStorage.getItem('interviewStartTime');
		const name = localStorage.getItem('name')
		let duration=0;
		let interviewDuration = 0;
		if (StartTime) {
			duration = (Date.now()-StartTime)/1000;
			console.log('response duration:', duration);
			localStorage.removeItem('questionStartTime');
		}
		if(interviewStartTime)
		{
			interviewDuration = (Date.now()-interviewStartTime)/1000;
			console.log('response duration:', interviewDuration);
		}
		if(interviewDuration>1200 || duration>120)
		{
			message = "Please End the Interview";
		}

		this.socket.emit("message", { question: message,duration,interviewStartTime,name });

		let response = await new Promise((resolve, reject) => {
			this.socket.on("responseMessage", (response) => {
				if (response) {
					resolve(response);
				} else {
					reject(response);
				}
			});
		});

		return response;
	}
}

export const chatbotService = new ChatbotService();
