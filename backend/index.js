require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
require("./services/passportConfig");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoute");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || "mySuperSecret",
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  

mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connecté"))
.catch((err) => console.error("Erreur de connexion MongoDB :", err));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅Serveur démarré sur http://localhost:${PORT}`));
