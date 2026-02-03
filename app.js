/***********************
 🔐 SUPABASE CONFIG
************************/
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "sb_publishable_PDtb5OQ18VM_OqxMNh3r9w_AOx17ynG";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/***********************
 🤖 GEMINI CONFIG
************************/
const GEMINI_API_KEY = "AIzaSyCSxN1KKyvWExW4VYbf0DYoE2vk0TRu5jQ ";
const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${AIzaSyCSxN1KKyvWExW4VYbf0DYoE2vk0TRu5jQ }`;

/***********************
 🧠 DOM ELEMENTS
************************/
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatOutput = document.getElementById("chat-output");
const languageSelect = document.getElementById("language");

/***********************
 🌸 GREETINGS
************************/
const greetings = {
  eng: "Jai Shri Krishna 🙏 Ask me your problem.",
  hin: "जय श्री कृष्ण 🙏 अपनी समस्या बताइए।",
  hing: "Jai Shri Krishna 🙏 Batao apni problem."
};

/***********************
 💬 CHAT UI FUNCTION
************************/
function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = sender === "user" ? "user-message" : "bot-message";
  msgDiv.textContent = text;
  chatOutput.appendChild(msgDiv);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

/***********************
 🔐 AUTH FUNCTIONS
************************/
async function signUp(email, password) {
  const { error } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) alert(error.message);
  else alert("Signup successful! Check email.");
}

async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) alert(error.message);
  else alert("Login successful");
}

async function checkSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/***********************
 🤖 GEMINI RESPONSE
************************/
async function getBotResponse(question, lang) {
  const promptMap = {
    hin: `भगवान श्री कृष्ण के दृष्टिकोण से उत्तर हिंदी में दीजिए:\n${question}`,
    eng: `Answer like Lord Krishna with wisdom in English:\n${question}`,
    hing: `Bhagwan Krishna ke perspective se Hinglish me jawab do:\n${question}`
  };

  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: promptMap[lang] }]
        }
      ]
    })
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/***********************
 🚀 SEND MESSAGE
************************/
sendBtn.addEventListener("click", async () => {
  const question = userInput.value.trim();
  const language = languageSelect.value;

  if (!question) return;

  const session = await checkSession();
  if (!session) {
    alert("Please login first 🙏");
    return;
  }

  appendMessage("user", question);
  userInput.value = "";

  appendMessage("bot", "Thinking… 🧠");

  const botMsgDiv = chatOutput.querySelector(".bot-message:last-child");
  const answer = await getBotResponse(question, language);
  botMsgDiv.textContent = answer;
});

/***********************
 🌼 INIT
************************/
window.onload = () => {
  appendMessage("bot", greetings[languageSelect.value]);
};