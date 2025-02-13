import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { logout, auth } from "../firebase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaUser, FaRobot, FaPills, FaSearch, FaPaperPlane, FaPhone, FaWhatsapp } from "react-icons/fa";

function Chatbot() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [medicineResults, setMedicineResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to handle chatbot query
  const sendQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setMedicineResults([]);

    const userMessage = { text: query, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");

    try {
        const res = await axios.post("http://127.0.0.1:8000/api/chat/", {
            query: query,
            user_name: auth.currentUser?.displayName || "User",
        });

        const botMessage = { text: res.data.response, isBot: true };
        setMessages((prev) => [...prev, botMessage]);

        // ✅ If user asks for a doctor, show contact options
        if (query.toLowerCase().includes("doctor") || query.toLowerCase().includes("appointment")) {
            setMessages((prev) => [
                ...prev,
                { text: "👨‍⚕️ Contact a Doctor:", isBot: true, isDoctor: true }
            ]);
        }

    } catch (error) {
        setMessages((prev) => [...prev, { text: "⚠️ Error connecting to chatbot.", isBot: true }]);
    }
    setLoading(false);
  };

  // Function to fetch medicine details
  const fetchMedicine = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setMessages([]);

    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/medicine/?name=${query}`);
      if (res.data.medicines) {
        setMedicineResults(res.data.medicines.slice(0, 3));
      } else {
        setMedicineResults([{ name: "❌ No medicine found", description: "Try another search" }]);
      }
    } catch (error) {
      setMedicineResults([{ name: "⚠️ Error fetching medicines", description: "Check the backend API" }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-lg">
        <h1 className="text-3xl font-extrabold text-blue-400 animate-pulse">💊 AI Medical Chatbot</h1>
        <button onClick={logout} className="px-4 py-2 bg-red-500 hover:bg-red-700 rounded-lg">
          Logout
        </button>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length > 0 &&
          messages.map((msg, index) => (
            <div key={index} className={`flex items-start space-x-3 ${msg.isBot ? "justify-start" : "justify-end"}`}>
              {msg.isBot ? (
                <div className="bg-gray-800 p-4 rounded-lg max-w-2xl shadow-lg border-l-4 border-green-400">
                  <FaRobot className="inline text-green-400 mr-2" />
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>

                  {/* ✅ Show doctor contact options if it's a doctor query */}
                  {msg.isDoctor && (
                    <div className="mt-4">
                      <a href="tel:+919876543210" className="flex items-center bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-700 text-white mb-2">
                        <FaPhone className="mr-2" /> Call Doctor
                      </a>
                      <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center bg-green-500 px-4 py-2 rounded-md hover:bg-green-700 text-white mb-2">
                        <FaWhatsapp className="mr-2" /> Chat on WhatsApp
                      </a>
                      <a href="/book-appointment" className="flex items-center bg-yellow-500 px-4 py-2 rounded-md hover:bg-yellow-700 text-white">
                        📅 Book Appointment
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-blue-500 p-4 rounded-lg max-w-2xl text-white shadow-lg border-l-4 border-blue-300">
                  <FaUser className="inline mr-2" />
                  {msg.text}
                </div>
              )}
            </div>
          ))}

        {/* Medicine Search Results */}
        {medicineResults.length > 0 && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-lg font-bold text-yellow-400">🩺 Medicine Results:</h2>
            {medicineResults.map((med, index) => (
              <div key={index} className="mt-2 p-3 bg-gray-700 rounded-lg">
                <h3 className="text-md font-semibold text-blue-300">{med.name}</h3>
                <p><strong>💊 Active Ingredient:</strong> {med.active_ingredient || "Not available"}</p>
                <p><strong>📌 Purpose:</strong> {med.purpose || "Not available"}</p>
                <p><strong>⚠️ Warnings:</strong> {med.warnings || "No warnings available"}</p>
                <p><strong>📝 Dosage:</strong> {med.dosage || "Not available"}</p>
                {med.buy_link && (
                  <a href={med.buy_link} target="_blank" rel="noopener noreferrer" className="text-green-400 underline">
                    🛒 Buy Online
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {loading && <p className="text-center text-gray-400 animate-pulse">⏳ Loading...</p>}

        <div ref={chatRef} />
      </div>

      {/* Input Box */}
      <div className="flex items-center p-4 border-t border-gray-700">
        <input
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white outline-none"
          placeholder="Ask a question or search for a medicine..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendQuery()}
        />
        <button className="ml-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 flex items-center" onClick={sendQuery}>
          <FaPaperPlane className="mr-2" /> Send
        </button>
        <button className="ml-2 px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600 flex items-center" onClick={fetchMedicine}>
          <FaSearch className="mr-2" /> Search Medicine
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
