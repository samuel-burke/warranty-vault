import prisma from "../db/client.js";

// GET all assets
export const getAssets = async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      include: { user: true, documents: true }
    });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single asset
export const getAssetById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: { user: true, documents: true }
    });
    if (!asset) return res.status(404).json({ error: "Asset not found" });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * example request body:
 * {
 *   "name": "Laptop",
 *   "category": "Electronics",
 *   "purchaseDate": "2023-01-15",
 *   "warrantyExpiration": "2025-01-15",
 *  "status": "active",
 *   "description": "Work laptop",
 *   "userId": 1
 * }            
 */
export const createAsset = async (req, res) => {
  const { name, category, purchaseDate, warrantyExpiration, status, description, userId } = req.body;
  try {
    const asset = await prisma.asset.create({
      data: {
        name,
        category,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        warrantyExpiration : warrantyExpiration ? new Date(warrantyExpiration) : null,
        status: status ? status : "active",
        description: description ? description : "",
        user: { connect: { id: userId } }
      }
    });
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE asset
export const updateAsset = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, category, purchaseDate, warrantyPeriodMonths } = req.body;
  try {
    const asset = await prisma.asset.update({
      where: { id },
      data: {
        name,
        category,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        warrantyPeriodMonths
      }
    });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE asset
export const deleteAsset = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.asset.delete({ where: { id } });
    res.json({ message: "Asset deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
