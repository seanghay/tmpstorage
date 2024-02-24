import 'dotenv/config.js';
import express from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';
import path from 'node:path';
import fs from 'node:fs/promises';
import GracefulShutdown from 'http-graceful-shutdown';

const upload = multer({
  limits: {
    fileSize: 100 * 1024 * 1024 // 100mb
  },
  storage: multer.diskStorage({
    destination: "uploads",
    filename(req, file, callback) {
      callback(null, `${nanoid(11)}_${file.originalname}`);
    }
  }),
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '100mb' }));
app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    res.json({ file: req.file.path });
    return
  } catch (e) {
    res.status(500).json({ msg: 'error', });
  }
})

app.listen(8000);
GracefulShutdown(app);