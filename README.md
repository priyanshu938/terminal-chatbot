📟 Jarvis – AI Terminal Chatbot

A terminal-based AI assistant powered by Groq’s Llama 3.3 models with automatic real-time web search using the Tavily API.
Jarvis intelligently decides when to search the internet and when to answer from its own reasoning — all inside your terminal.

⸻

🚀 Features
	•	🤖 Conversational AI using llama-3.3-70b-versatile
	•	🔍 Real-time Web Search powered by Tavily
	•	🧠 Multi-turn conversations with preserved history
	•	⚡ Automatic tool calling (LLM decides when a web search is needed)
	•	💬 Clean terminal UI
	•	🔑 Environment-based API key management

⸻

🛠️ How It Works
	1.	You ask a question in the terminal
	2.	Groq LLM analyses whether the query needs web search
	3.	If required, it generates a search query
	4.	Tavily API fetches updated information
	5.	Search results are injected into the conversation
	6.	Groq produces a final answer
	7.	Response is displayed in the terminal

⸻

📦 Prerequisites
	•	Node.js 14+
	•	Groq API Key – https://console.groq.com
	•	Tavily API Key – https://tavily.com

⸻

📥 Installation

1️⃣ Clone the repository

git clone https://github.com/your-username/jarvis-cli.git
cd jarvis-cli

2️⃣ Install dependencies

npm install

3️⃣ Create a .env file

GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key


⸻

▶️ Usage

Start the chatbot:

node app.js

Then type your questions:

You: What is the latest update on AI?
Jarvis: Searching the web...

Exit anytime:

exit


⸻

📂 Project Structure

jarvis-cli/
│
├── app.js            # Main chatbot implementation
├── package.json
├── .env              # API keys (not committed)
└── README.md


⸻

🧪 Example Terminal Output

You: Who is the CEO of Tesla?
Jarvis: Let me check the latest info from the web...

You: Explain quantum computing.
Jarvis: Sure! Quantum computing is...


⸻

📚 Dependencies
	•	groq-sdk — Groq API client
	•	@tavily/core — Web search
	•	readline — Terminal input

⸻

📄 License

ISC License

⸻