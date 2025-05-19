import express from "express";
import multer from "multer";
import path from "path";
import apm from 'elastic-apm-node';
const router = express.Router();

// Define the absolute path for the images directory
const absoluteImagesPath = '/var/www/react-app/images';

// Configure Multer with the absolute path
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, absoluteImagesPath);
  },
  filename: (req, file, cb) => {
    const slug = req.body.slug;
    const ext = ".png";
    cb(null, `${slug}${ext}`); // File named after slug with a fixed extension
  },
});

const upload = multer({ storage });

// API endpoint for file upload
router.post("/upload", upload.single("icon"), (req, res) => {
  if (!req.file) {
    apm.captureError(new Error('No file uploaded'));
    return res.status(400).json({ message: "No file uploaded" });
  }
  const slug = req.body.slug;
  res.json({
    message: "File uploaded successfully",
    iconName: slug,
  });
});

export default router;
