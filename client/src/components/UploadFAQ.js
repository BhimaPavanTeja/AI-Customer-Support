import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function UploadFAQ() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Check for admin role before showing this page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin") {
        navigate("/login");
      }
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("faqFile", file);

    try {
      setUploading(true);
      const res = await axios.post("https://ai-customer-support-dvyk.onrender.com/faq/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage(res.data.message || "Upload successful");
    } catch (err) {
      setMessage("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 relative">
      <nav className="absolute top-6 right-8">
        <Link
          to="/login"
          className="text-red-500 font-medium hover:underline transition"
        >
          Logout
        </Link>
        <Link
          to="/admin/uploads"
          className="text-blue-600 font-medium ml-4 hover:underline transition"
        >
          View Uploads
        </Link>
      </nav>
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          📁 Upload FAQ or Company Docs
        </h2>
        <input
          type="file"
          accept=".txt,.pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded font-semibold transition hover:bg-blue-600 ${
            uploading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {message && (
          <p className="mt-4 text-sm text-center text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}

export default UploadFAQ;
