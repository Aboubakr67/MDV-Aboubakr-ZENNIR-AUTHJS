require("dotenv").config();
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");
const OTPAuth = require("otpauth");
const QRCode = require("qrcode");
const otpCheck = require("../middlewares/otpCheck");


// Vérification de l'authentification
router.get("/me", authMiddleware, (req, res) => {
    res.json({ success: true, user: req.user });
  });

  // Déconnexion
router.post("/logout", (req, res) => {
res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
res.clearCookie("otp_verified", { httpOnly: true, sameSite: "lax" });
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
  router.get("/intervenants", authMiddleware, otpCheck, (req, res) => {
    if(req.user.role !== "admin") {
      return res.status(401).json({ success: false, message: "Accès non autorisé. Veuillez vous connecter." });
    }
    User.find({ role: "intervenant" })
      .then(users => res.json({ success: true, intervenants:users }))
      .catch(err => res.status(500).json({ success: false, message: "Erreur lors de la récupération des intervenants" }));
  });

  router.get("/generate-otp-secret", authMiddleware, async (req, res) => {
    const user = req.user;
  
    if (user.role !== "admin") return res.status(403).json({ message: "Accès interdit" });
  
    const totp = new OTPAuth.TOTP({
      issuer: "MDV-Aboubakr-Zennir-AuthJS",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
    });
  
    const base32 = totp.secret.base32;
    const otpauthURL = totp.toString();
    const qrCode = await QRCode.toDataURL(otpauthURL);
  
    
    await User.findByIdAndUpdate(user._id, { otpSecret: base32 });
  
    res.json({ success: true, qrCode });
  });

  router.post("/verify-otp", authMiddleware, async (req, res) => {
    const { otpCode } = req.body;
    const user = await User.findById(req.user._id);
  
    if (!otpCode) {
      return res.status(400).json({ success: false, message: "Code OTP manquant" });
    }
  
    const totp = new OTPAuth.TOTP({
      issuer: "MyApp",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(user.otpSecret),
    });
  
    const delta = totp.validate({ token: otpCode, window: 1 });
  
    if (delta !== null) {
      res.cookie("otp_verified", true, {
        httpOnly: true,
        maxAge: 5 * 60 * 1000, // 5 minutes
      });
      return res.json({ success: true });
    }
  
    return res.status(401).json({ success: false, message: "Code OTP invalide" });
  });
  
  



module.exports = router;
