require("dotenv").config();
const express = require("express");
const router = express.Router();
const { createUser, login, generateToken } = require("../services/authServices");
const passport = require("passport");

// ---------------------------------------------- INSCRIPTION --------------------------------------

router.post("/register", async (req, res) => {
  const { nom, prenom, email, password } = req.body;
  const result = await createUser(nom, prenom, email, password);

  if (!result.success) {
    return res.status(400).json({ result });
  }

  const token = generateToken(result.user);
  res.cookie("token", token, {httpOnly: true, sameSite: "lax", maxAge: 3600000});
  console.log("Nouvelle utilisateur créée");
  console.log("Nom : " + result.user.nom + " - " + "Email : " + result.user.email);
  return res.status(200).json({ result });
});

// ---------------------------------------------- CONNEXION --------------------------------------

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await login(email, password);

  if (!result.success) {
    return res.status(400).json({ result });
  }
  const token = generateToken(result.user);
  res.cookie("token", token, {httpOnly: true, sameSite: "lax", maxAge: 3600000});

  console.log("Utilisateur connecté");
  console.log("Nom : " + result.user.nom + " - " + "Email : " + result.user.email);
  return res.status(200).json({ result });
});


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));


router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = generateToken(req.user);
    res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 3600000 });
    res.redirect("http://localhost:5173");
  }
);


module.exports = router;
