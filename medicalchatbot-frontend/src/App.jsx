import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Chatbot from "./components/chatbot";
import Login from "./components/login";

function App() {
  const [user, loading, error] = useAuthState(auth);

  console.log("User:", user);
  console.log("Loading:", loading);
  console.log("Error:", error);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Chatbot /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
