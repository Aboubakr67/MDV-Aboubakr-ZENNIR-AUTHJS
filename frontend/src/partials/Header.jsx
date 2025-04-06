import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">CiveLampus</h1>

        <nav>
          <ul className="flex flex-wrap gap-3 items-center">
            {user ? (
              <>
                <li>
                  <Link
                    to="/"
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition"
                  >
                    Accueil
                  </Link>
                </li>
                {user.role === "etudiant" && (
                  <li>
                    <Link
                      to="/etudiant-details"
                      className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition"
                    >
                      Informations
                    </Link>
                  </li>
                )}
                {(user.role === "intervenant" || user.role === "admin") && (
                  <li>
                    <Link
                      to="/etudiant-lists"
                      className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition"
                    >
                      Liste des étudiants
                    </Link>
                  </li>
                )}
                {user.role === "admin" && (
                  <li>
                    <Link
                      to="/intervenant-list"
                      className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition"
                    >
                      Liste des intervenants
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                  >
                    Se déconnecter
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition"
                  >
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md transition"
                  >
                    Inscription
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
