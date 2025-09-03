import express from "express";
import { upload, uploadDocument, getDocumentsByAsset } from "../controllers/DocumentController.js";

const router = express.Router();

// Upload a file to an asset
router.post("/:assetId", upload.single("file"), uploadDocument);

// List documents for an asset
router.get("/:assetId", getDocumentsByAsset);

export default router;
