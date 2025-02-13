import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signOut } from "firebase/auth"; // ✅ Import GoogleAuthProvider

const firebaseConfig = {
  apiKey: "AIzaSyDS-FT9qSH-5mbfShcjIkN4V3-AXb_aooA",
  authDomain: "ai-medical-chatbot-abhi123.firebaseapp.com",
  projectId: "ai-medical-chatbot-abhi123",
  storageBucket: "ai-medical-chatbot-abhi123.appspot.com",
  messagingSenderId: "751392421110",
  appId: "1:751392421110:web:71b7e7125b7971334228d7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); // ✅ Add this line

// Logout function
const logout = () => {
  signOut(auth)
    .then(() => console.log("User signed out"))
    .catch((error) => console.error("Error signing out:", error));
};

export { auth, provider, logout }; // ✅ Export provider
