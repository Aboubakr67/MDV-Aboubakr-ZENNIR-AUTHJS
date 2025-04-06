const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

async function createUser(nom, prenom, email, password) {
  if (!nom || !prenom || !email || !password) {
    return { success: false, message: "Veuillez remplir tous les champs !" };
  }

  if (password.length < 12) {
    return { success: false, message: "Le mot de passe doit contenir au moins 12 caractères !" };
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: "Cet email est déjà utilisé !" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ nom, prenom, email, password: hashedPassword, role: "etudiant" });
    await user.save();
    const { password: userPassword, ...userWithoutPassword } = user.toObject();

    return { success: true, message: "Utilisateur créé avec succès !", user: userWithoutPassword };
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    return { success: false, message: "Erreur interne du serveur." };
  }
}

async function login(email, password) {
  if (!email || !password) {
    return { success: false, message: "Veuillez remplir tous les champs !" };
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "Email ou mot de passe incorrect !" };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(isMatch) {
      const { password: userPassword, ...userWithoutPassword } = user.toObject();
      return { success: true, message: "Connexion réussie !", user: userWithoutPassword };
    } else {
      return { success: false, message: "Email ou mot de passe incorrect !" }
    }

  } catch (error) {
    console.error("Erreur lors de la vérification du mot de passe :", error);
    return { success: false, message: "Erreur interne du serveur." };
  }
}

function generateToken(user) {
  return jwt.sign({ username: user.username, email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

module.exports = { createUser, login, generateToken };
