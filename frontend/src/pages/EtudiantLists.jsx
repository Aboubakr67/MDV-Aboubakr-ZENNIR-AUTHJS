import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EtudiantLists = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "intervenant")) {
      navigate("/login");
      return;
    }
    const fetchEtudiants = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/user/etudiants",
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success) {
          setEtudiants(data.etudiants);
        } else {
          setError(data.message || "Erreur lors du chargement");
        }
      } catch (err) {
        setError("Erreur lors de la récupération des étudiants.");
      } finally {
        setLoading(false);
      }
    };

    fetchEtudiants();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-blue-600">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          👨‍🎓 Liste des Étudiants
        </h2>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-4 text-left">Nom</th>
                <th className="p-4 text-left">Prénom</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {etudiants &&
                etudiants.map((etudiant) => (
                  <tr key={etudiant._id} className="hover:bg-gray-50 border-b">
                    <td className="p-4">{etudiant.nom}</td>
                    <td className="p-4">{etudiant.prenom}</td>
                    <td className="p-4">{etudiant.email}</td>
                    <td className="p-4">
                      {new Date(etudiant.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EtudiantLists;
