import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-lg w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Bienvenue, {user?.nom} {user?.prenom} !
        </h2>
        <p className="text-gray-600 mb-6">
          Tu es connecté à ton espace personnel.
        </p>
      </div>
    </div>
  );
};

export default Home;
