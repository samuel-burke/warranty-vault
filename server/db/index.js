import express from "express";
import userRoutes from "./users.js";
import assetRoutes from "./assets.js";
import documentRoutes from "./documents.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/assets", assetRoutes);
router.use("/documents", documentRoutes);

export default router;
