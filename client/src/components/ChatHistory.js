import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function ChatHistory({ userId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    // Fetching chat history from the server
    axios.get(`https://ai-customer-support-d7b5.onrender.com/chat/history/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setHistory(res.data.messages || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching chat history:", err);
        setError("Unable to load chat history.");
        setLoading(false);
      });
  }, [userId, navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="absolute left-4 top-4 text-xl text-center font-semibold italic text-gray-700">
        AI Customer Support
      </div>
      <nav className="absolute top-6 right-6 mb-6 space-x-6">
        <Link to="/chat" className="text-blue-500 font-medium hover:underline">Go to Chat</Link>
      </nav>
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">🕘 Chat History</h3>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : history.length === 0 ? (
          <p>No history found.</p>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-md min-w-[calc(100vw-500px)] max-h-[calc(100vh-80px)] overflow-y-auto space-y-3">
            {history.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded px-4 py-2 text-sm ${msg.role === "user" ? "bg-blue-100" : "bg-green-100"}`}>
                  <b>{msg.role === "user" ? "You" : "Agent"}:</b> {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatHistory;
