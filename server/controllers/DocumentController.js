import multer from "multer";
import path from "path";
import prisma from "../db/client.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });

export const uploadDocument = async (req, res) => {
  const assetId = parseInt(req.params.assetId);
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const doc = await prisma.document.create({
      data: {
        fileName: req.file.originalname,
        fileUrl: req.file.path,
        assetId: assetId
      }
    });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDocumentsByAsset = async (req, res) => {
  const assetId = parseInt(req.params.assetId);
  try {
    const docs = await prisma.document.findMany({ where: { assetId } });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
