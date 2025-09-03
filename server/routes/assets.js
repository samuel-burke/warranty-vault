import express from "express";
import {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset
} from "../controllers/AssetController.js";

const router = express.Router();

// GET all assets
router.get("/", getAssets);

// GET asset by ID
router.get("/:id", getAssetById);

// CREATE asset (must provide userId)
router.post("/", createAsset);

// UPDATE asset
router.put("/:id", updateAsset);

// DELETE asset
router.delete("/:id", deleteAsset);

export default router;
