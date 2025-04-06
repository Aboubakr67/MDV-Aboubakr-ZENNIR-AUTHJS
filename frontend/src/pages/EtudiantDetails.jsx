import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "etudiant") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          📄 Mes Informations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-500">Nom</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {user.nom}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-500">Prénom</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {user.prenom}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg shadow-sm col-span-1 sm:col-span-2">
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {user.email}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-500">Rôle</p>
            <p className="text-lg font-semibold text-gray-800 mt-1 capitalize">
              {user.role}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-gray-500">Créé le</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
