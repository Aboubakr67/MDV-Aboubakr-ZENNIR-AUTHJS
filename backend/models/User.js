const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
      nom: { type: String, required: true},
      prenom: { type: String, required: true},
      email: { type: String, required: true, unique: true },
      password: { type: String, required: false },
      role: { type: String, enum: ["etudiant", "intervenant", "admin"], default: "etudiant" },
      otpSecret: { type: String, default: null },
    },
    {
      timestamps: true
    }
  );

module.exports = mongoose.model("User", userSchema);
