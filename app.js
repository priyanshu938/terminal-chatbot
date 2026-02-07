/**
User Question
    ↓
Groq LLM (decides to use tool)
    ↓
Extract tool call (webSearch + query)
    ↓
Execute webSearch(query) → Tavily API
    ↓
Get results back
    ↓
Add to message history
    ↓
Send back to Groq with results
    ↓
Groq generates final answer
    ↓
Output final response
 */

import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import readline from "readline";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function chat(userMessage, conversationHistory) {
  const messages = [
    { role: "system", content: "You are Jarvis, a smart personal assistant. Be polite and helpful. Use the webSearch tool to find current information." },
    ...conversationHistory,
    { role: "user", content: userMessage }
  ];

  let completion = await getGroqChatCompletion(messages);

  // Handle tool calls
  while (completion.choices[0]?.message?.tool_calls) {
    const toolCall = completion.choices[0].message.tool_calls[0];

    if (toolCall.function.name === "webSearch") {
      const args = typeof toolCall.function.arguments === "string"
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function.arguments;

      const toolResult = await webSearch(args.query);

      // Add assistant message and tool result to messages
      messages.push(completion.choices[0].message);
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: toolResult
      });

      completion = await getGroqChatCompletion(messages);
    }
  }

  const assistantMessage = completion.choices[0]?.message?.content || "I couldn't generate a response.";

  // Add to conversation history
  conversationHistory.push({ role: "user", content: userMessage });
  conversationHistory.push({ role: "assistant", content: assistantMessage });

  return assistantMessage;
}

export const getGroqChatCompletion = async (messages) => {
  return groq.chat.completions.create({
    messages,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    tools: [
      {
        type: "function",
        function: {
          name: "webSearch",
          description: "Search the web for current information",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The search query to find information"
              }
            },
            required: ["query"]
          }
        }
      }
    ],
    tool_choice: "auto"
  });
};

async function webSearch(query) {
  try {
    const searchResults = await tvly.search(query);
    return JSON.stringify(searchResults.results.slice(0, 3).map(r => ({ title: r.title, content: r.content }))) || "No results found.";
  } catch (error) {
    console.error("Search error:", error);
    return "Unable to fetch search results at the moment.";
  }
}

async function startChatbot() {
  console.log("\n🤖 Welcome to Jarvis - Your AI Assistant");
  console.log("Type 'exit' to quit the chat\n");

  let conversationHistory = [];

  while (true) {
    const userInput = await prompt("You: ");

    if (userInput.toLowerCase() === "exit") {
      console.log("\nGoodbye! 👋");
      rl.close();
      break;
    }

    if (!userInput.trim()) {
      continue;
    }

    try {
      const response = await chat(userInput, conversationHistory);
      console.log(`\nJarvis: ${response}\n`);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

startChatbot();