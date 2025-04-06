import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const IntervenantList = () => {
  const [intervenants, setIntervenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchIntervenants = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user/intervenants", {
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/otp-verify");
          return;
        }

        const data = await res.json();
        if (data.success) {
          setIntervenants(data.intervenants);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des intervenants :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIntervenants();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg">Chargement en cours...</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        👨‍🏫Liste des Intervenants
      </h2>

      {intervenants.length === 0 ? (
        <p className="text-gray-500 text-center">Aucun intervenant trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intervenants.map((intervenant) => (
            <div
              key={intervenant._id}
              className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition"
            >
              <h3 className="text-xl font-medium text-blue-600 mb-2">
                {intervenant.nom} {intervenant.prenom}
              </h3>
              <p className="text-gray-600">Email : {intervenant.email}</p>
              <p className="text-gray-500 text-sm mt-2">
                Créé le :{" "}
                {new Date(intervenant.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IntervenantList;
