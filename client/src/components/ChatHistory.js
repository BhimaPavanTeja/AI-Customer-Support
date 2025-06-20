import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ChatHistory({ userId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await axios.get(`http://localhost:5000/chat/history/${userId}`);
        setHistory(res.data.messages);
      } catch (err) {
        console.error("Error fetching chat history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [userId]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl text-white font-semibold">🕘 Chat History</h3>
        <Link to="/" className="text-blue-600 text-sm underline">
          ← Back to Chat
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No chat history found.</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto bg-white p-4 rounded-lg border shadow-md">
          {history.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`rounded px-4 py-2 text-sm ${msg.role === "user" ? "bg-blue-100" : "bg-green-100"}`}>
                <b>{msg.role === "user" ? "You" : "Agent"}:</b> {msg.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatHistory;
