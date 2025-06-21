import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./components/Chat";
import ChatHistory from "./components/ChatHistory";
import UploadFAQ from "./components/UploadFAQ";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");
  // Check if the user is logged in by verifying the token

  return (
    <Router>
      <div>

        <Routes>
        {/* Default path shows login or chat if already logged in */}
        <Route path="/" element={token ? <Navigate to="/chat" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><ChatHistory userId="demoUser" /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadFAQ /></ProtectedRoute>} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
