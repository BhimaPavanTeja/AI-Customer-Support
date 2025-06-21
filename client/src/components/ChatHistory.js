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

    axios.get(`http://localhost:5000/chat/history/${userId}`, {
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
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-2">AI Customer Support</h1>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">🕘 Chat History</h3>
          <Link to="/" className="text-blue-600 text-sm underline">
            ← Back to Chat
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : history.length === 0 ? (
          <p>No history found.</p>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow max-h-96 overflow-y-auto space-y-3">
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
