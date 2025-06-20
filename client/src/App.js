import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Chat from "./components/Chat";
import ChatHistory from "./components/ChatHistory";

function App() {
  return (
    <Router>
      <div className="relative text-center p-4">
        <h1 className="text-2xl text-white font-bold mb-2">AI Customer Support</h1>
        <nav className="absolute top-4 right-4 mb-4 space-x-4">
          <Link to="/history" className="text-blue-500 hover:underline">History</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/history" element={<ChatHistory userId="demoUser" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
