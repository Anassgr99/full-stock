import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import apm from "elastic-apm-node";

// Import des routes
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import unitRoutes from "./routes/unitRoutes.js";
import orderRouter from "./routes/orderRouter.js";
import userRoutes from "./routes/userRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import storeProductRoutes from "./routes/storeProductRoutes.js";
import storesRoutes from "./routes/storeRouter.js";
import ReturnsRoutes from "./routes/RetournerRoutes.js";
import uploadExcelRoutes from "./routes/uploadExcelRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import downloadExcelRoutes from "./routes/downloadExcelRoutes.js";
import { verifyToken } from "./config/jwtUtils.js";

// Étape 1 : Démarrage d'APM avec capture d'erreur
try {
  apm.start({
    serviceName: process.env.APM_SERVICE_NAME,
    serverUrl: process.env.APM_SERVER_URL,
    secretToken: process.env.APM_SECRET_TOKEN,
    environment: process.env.APM_ENVIRONMENT,
  });
  apm.logger.info("✅ Elastic APM initialisé");
} catch (error) {
  apm.logger.error("❌ Erreur lors de l'initialisation d'Elastic APM:", error);
  apm.captureError(error);
}

dotenv.config(); // Étape 2 : Chargement des variables d'environnement
if (!process.env.PORT) {
  apm.logger.error("❌ PORT non défini dans .env");
  apm.captureError(new Error("PORT non défini dans .env"));
}

const app = express();
const PORT = process.env.PORT || 3000;

// Définir __dirname manuellement en ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Étape 3 : Gestion de __dirname
try {
  // Réaffectation uniquement pour la vérification
  const tempFilename = fileURLToPath(import.meta.url);
  const tempDirname = path.dirname(tempFilename);
  apm.logger.info("✅ __dirname défini :", tempDirname);
} catch (error) {
  apm.logger.error("❌ Erreur lors de la définition de __dirname:", error);
  apm.captureError(error);
}

// Middleware de limitation de requêtes avec gestion d'erreur
try {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 900,
    message: "Trop de requêtes effectuées depuis cette adresse IP, veuillez réessayer plus tard.",
  });
  app.use(limiter);
  apm.logger.info("✅ Middleware rate-limit activé");
} catch (error) {
  apm.logger.error("❌ Erreur lors de l'activation du middleware rate-limit:", error);
  apm.captureError(error);
}

// Étape 4 : Ajout des middlewares avec gestion d'erreur
try {
  app.use(express.json());
  app.use(cors({ origin: "http://localhost:5173" }));
  apm.logger.info("✅ Middlewares Express activés");
} catch (error) {
  apm.logger.error("❌ Erreur lors de l'application des middlewares:", error);
  apm.captureError(error);
}

// Étape 5 : Servir les fichiers statiques
try {
  app.use("/images", express.static(path.join(__dirname, "../../front/public/images")));
  apm.logger.info("✅ Fichiers statiques servis depuis /images");
} catch (error) {
  apm.logger.error("❌ Erreur lors du chargement des fichiers statiques:", error);
  apm.captureError(error);
}

// Étape 6 : Définition des routes API avec gestion d'erreur
try {
  app.use("/api", productRoutes);
  app.use("/api", unitRoutes);
  app.use("/api/categorys", categoryRoutes);
  app.use("/api/orders", orderRouter);
  app.use("/api", userRoutes);
  app.use("/api", customerRoutes);
  app.use("/api/store-products", storeProductRoutes);
  app.use("/api/stores", storesRoutes);
  app.use("/api/returns", ReturnsRoutes);
  app.use("/api/", uploadExcelRoutes);
  app.use("/api", uploadRoutes);
  app.use('/api', downloadExcelRoutes);
  apm.logger.info("✅ Routes API chargées avec succès");
} catch (error) {
  apm.logger.error("❌ Erreur lors du chargement des routes API:", error);
  apm.captureError(error);
}

// Étape 7 : Middleware global de gestion des erreurs
app.use((err, req, res, next) => {
  apm.logger.error("❌ Middleware d'erreur détecté :", err.message);
  apm.captureError(err);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

// Étape 8 : Capture des erreurs non gérées (pour éviter les crashs en production)
process.on("uncaughtException", (error) => {
  apm.logger.error("❌ Erreur critique : uncaughtException", error);
  apm.captureError(error);
  process.exit(1); // Optionnel : forcer le redémarrage du serveur
});

process.on("unhandledRejection", (reason, promise) => {
  apm.logger.error("❌ Rejet de promesse non géré :", reason);
  apm.captureError(reason);
});

// Étape 9 : Démarrage du serveur avec gestion d'erreur
app.listen(PORT, () => {
    apm.logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
  });

