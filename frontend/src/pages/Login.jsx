import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.result.success) {
        login(data.result.user);
        navigate("/");
      } else {
        setError(data.result.message);
      }
    } catch (err) {
      setError("Erreur lors de la connexion.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-lg w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Connexion</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-left text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-left text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300"
          >
            Se connecter
          </button>
        </form>
        <div className="mt-4 mb-4">
          <p className="text-gray-600">
            Pas de compte ?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              S'inscrire
            </a>
          </p>
        </div>
        <a
          href="http://localhost:3000/api/auth/google"
          className="inline-block w-full sm:w-auto"
        >
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200 w-full sm:w-auto"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span className="font-medium">Se connecter avec Google</span>
          </button>
        </a>
      </div>
    </div>
  );
};

export default Login;
