import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { chatStore } from "../stores/ChatStore";
import axios from "axios";

const Chat = observer(() => {
  const [input, setInput] = useState("");
  const chatEndRef = useRef();

  // Always scroll to bottom on new message or loading state
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatStore.messages, chatStore.loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    chatStore.addMessage(userMsg);
    setInput("");
    chatStore.setLoading(true);

    try {
      const res = await axios.post("https://ai-customer-support-d7b5.onrender.com/chat", {
        message: input,
        userId: "demoUser",
      });

      const botMsg = { role: "assistant", content: res.data.reply };
      chatStore.addMessage(botMsg);
    } catch (err) {
      chatStore.addMessage({
        role: "assistant",
        content: "Error: " + err.message,
      });
    } finally {
      chatStore.setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="max-w-2xl w-full mx-auto flex flex-col flex-1 p-4">
        <h1 className="text-2xl font-bold mb-2">AI Customer Support</h1>
        {/* Chat Container */}
        <nav className="absolute top-4 right-4 mb-4 space-x-4">
          <Link to="/history" className="text-blue-500 font-medium hover:underline">History</Link>
          <Link to="/login" className="text-red-500 font-medium hover:underline">Logout</Link>
        </nav>
        <div className="rounded-lg flex-1 overflow-y-auto p-4 bg-white shadow-md">
          {/* Placeholder */}
          {chatStore.messages.length === 0 && !chatStore.loading && (
            <div className="text-gray-400 text-lg text-center mt-32">
              👋🏻 Start typing to ask AI
            </div>
          )}

          {/* Messages */}
          {chatStore.messages.map((msg, i) => (
            <div
              key={i}
              className={`my-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg px-4 py-2 text-sm max-w-[80%] ${
                  msg.role === "user" ? "bg-blue-200 text-right" : "bg-green-100 text-left"
                }`}
              >
                <span>{msg.content}</span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {chatStore.loading && (
            <div className="my-2 flex justify-start">
              <div className="rounded-lg px-4 py-2 text-sm italic text-gray-600">
                ❇️ Agent is typing...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex mt-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="flex-1 bg-white shadow-md rounded-l px-3 py-2 focus:outline-none"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 shadow-lg cursor-pointer text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
});

export default Chat;
