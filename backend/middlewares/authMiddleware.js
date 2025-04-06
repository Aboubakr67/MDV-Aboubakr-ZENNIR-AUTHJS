const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token; 

  if (!token) {
    return res.status(401).json({ success: false, message: "Accès non autorisé. Veuillez vous connecter." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
    }
    const { password, ...userWithoutPassword } = user.toObject();

    req.user = userWithoutPassword;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalide ou expiré." });
  }
};

module.exports = authMiddleware;
