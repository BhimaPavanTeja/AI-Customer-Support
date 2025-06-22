import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function ViewUploads() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const { role } = JSON.parse(atob(token.split(".")[1]));
    if (role !== "admin") {
      navigate("/login");
      return;
    }

    axios
      .get(`https://ai-customer-support-d7b5.onrender.com/faq/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFaqs(res.data.faqs || []);
      })
      .catch((err) => {
        console.error("Failed to fetch FAQs:", err);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-purple-200">
      <nav className="absolute top-6 right-8">
        <Link
          to="/upload"
          className="text-blue-600 font-medium ml-4 hover:underline transition pr-4"
        >
          Uploads
        </Link>
        <Link
          to="/login"
          className="text-red-500 font-medium hover:underline transition"
        >
          Logout
        </Link>
      </nav>
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">📂 Uploaded FAQ Files</h2>
        {loading ? (
          <p>Loading...</p>
        ) : faqs.length === 0 ? (
          <p>No uploaded files yet.</p>
        ) : (
          <ul className="space-y-4">
            {faqs.map((faq, idx) => (
              <li
                key={idx}
                className="p-4 rounded shadow-md bg-white text-sm text-left"
              >
                <p>
                  <strong>Uploaded At:</strong>{" "}
                  {new Date(faq.uploadedAt).toLocaleString()}
                </p>
                <p>
                  <strong>Total Q&A Pairs:</strong> {faq.qaPairs.length}
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">View Q&A</summary>
                  <ul className="mt-2 list-disc ml-6">
                    {faq.qaPairs.map((pair, i) => (
                      <li key={i}>
                        <strong>Q:</strong> {pair.question}
                        <br />
                        <strong>A:</strong> {pair.answer}
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ViewUploads;
