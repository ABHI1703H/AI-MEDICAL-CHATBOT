import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      console.log("Google Sign-In Button Clicked");
      const result = await signInWithPopup(auth, provider);
      console.log("User Signed In:", result.user);

      navigate("/");  // ✅ Redirect to chatbot
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-900 text-white">
      <button
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-lg font-semibold"
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
