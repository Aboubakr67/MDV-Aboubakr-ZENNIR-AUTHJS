require("dotenv").config();
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");


// Vérification de l'authentification
router.get("/me", authMiddleware, (req, res) => {
    res.json({ success: true, user: req.user });
  });

  // Déconnexion
router.post("/logout", (req, res) => {
res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
res.json({ success: true, message: "Déconnexion réussie" });
});

// Informations de l'utilisateur connecté (uniquement étudiant)
  router.get("/mes-infos", authMiddleware, (req, res) => {
    if(req.user.role !== "etudiant") {
      return res.status(401).json({ success: false, message: "Accès non autorisé. Veuillez vous connecter." });
    }
    res.json({ success: true, user: req.user });
  });


  // Liste des étudiants (uniquement accessible aux intervenants et à l'admin)
  router.get("/etudiants", authMiddleware, (req, res) => {
    if(req.user.role !== "intervenant" && req.user.role !== "admin") {
      return res.status(401).json({ success: false, message: "Accès non autorisé. Veuillez vous connecter." });
    }
    User.find({ role: "etudiant" })
      .then(users => res.json({ success: true, etudiants:users }))
      .catch(err => res.status(500).json({ success: false, message: "Erreur lors de la récupération des étudiants" }));
  });

  // Liste des intervenants (uniquement accessible à l'admin)
  router.get("/intervenants", authMiddleware, (req, res) => {
    if(req.user.role !== "admin") {
      return res.status(401).json({ success: false, message: "Accès non autorisé. Veuillez vous connecter." });
    }
    User.find({ role: "intervenant" })
      .then(users => res.json({ success: true, intervenants:users }))
      .catch(err => res.status(500).json({ success: false, message: "Erreur lors de la récupération des intervenants" }));
  });


module.exports = router;
