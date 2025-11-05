// === Chatbot Loader ===
document.addEventListener("DOMContentLoaded", () => {
    const chatbotHTML = `
      <div id="chatbot-container">
        <div id="chatbot-button"><i class="fa-solid fa-robot"></i></div>
  
        <div id="chatbot-window" class="hidden">
          <div class="chat-header">
            <i class="fa-solid fa-robot"></i>
            <span>AI Assistant</span>
            <button id="chat-close">&times;</button>
          </div>
          <div class="chat-body" id="chat-body">
            <div class="bot-msg">Hi 👋 I’m your OS Assistant! Ask me anything about this page.</div>
          </div>
          <div class="chat-input">
            <input type="text" id="user-input" placeholder="Type your question..." />
            <button id="send-btn"><i class="fa-solid fa-paper-plane"></i></button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", chatbotHTML);
  
    // Add styles dynamically
    const css = document.createElement("style");
    css.innerHTML = `
      #chatbot-container {
        position: fixed;
        bottom: 30px;
        right: 30px;
        font-family: 'Poppins', sans-serif;
        z-index: 9999;
      }
      #chatbot-button {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #3b82f6, #9333ea);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        transition: transform 0.2s;
      }
      #chatbot-button:hover { transform: scale(1.1); }
      #chatbot-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 320px;
        background: rgba(17, 24, 39, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        backdrop-filter: blur(12px);
        overflow: hidden;
      }
      .hidden { display: none; }
      .chat-header {
        background: rgba(255,255,255,0.08);
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: white;
        font-weight: 600;
      }
      .chat-body {
        flex: 1;
        padding: 10px;
        overflow-y: auto;
        color: white;
        max-height: 250px;
      }
      .chat-input {
        display: flex;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      .chat-input input {
        flex: 1;
        border: none;
        background: transparent;
        color: white;
        padding: 10px;
        outline: none;
      }
      .chat-input button {
        background: none;
        border: none;
        color: #60a5fa;
        padding: 10px;
        cursor: pointer;
      }
      .bot-msg, .user-msg {
        background: rgba(255,255,255,0.08);
        margin: 5px 0;
        padding: 8px 12px;
        border-radius: 10px;
        width: fit-content;
        max-width: 80%;
      }
      .user-msg {
        background: #2563eb;
        margin-left: auto;
      }
    `;
    document.head.appendChild(css);
  
    // Logic
    const chatbotBtn = document.getElementById("chatbot-button");
    const chatbotWindow = document.getElementById("chatbot-window");
    const chatClose = document.getElementById("chat-close");
    const chatBody = document.getElementById("chat-body");
    const sendBtn = document.getElementById("send-btn");
    const userInput = document.getElementById("user-input");
  
    chatbotBtn.addEventListener("click", () => chatbotWindow.classList.toggle("hidden"));
    chatClose.addEventListener("click", () => chatbotWindow.classList.add("hidden"));
  
    sendBtn.addEventListener("click", async () => {
      const text = userInput.value.trim();
      if (!text) return;
      appendMsg("user", text);
      userInput.value = "";
  
      appendMsg("bot", "Thinking...");
      const response = await getAIResponse(text);
  
      // Replace last "Thinking..."
      chatBody.lastChild.remove();
      appendMsg("bot", response);
    });
  
    function appendMsg(sender, text) {
      const msg = document.createElement("div");
      msg.classList.add(sender === "user" ? "user-msg" : "bot-msg");
      msg.textContent = text;
      chatBody.appendChild(msg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  
    async function getAIResponse(query) {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query, topic: "Operating Systems" })
        });
    
        const data = await res.json();
        return data.reply;
      } catch (err) {
        console.error(err);
        return "Sorry, I couldn’t reach the AI server right now.";
      }
    }
    
  });
  