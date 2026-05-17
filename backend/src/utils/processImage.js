import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

/**
 * Compress + resize an uploaded image in-place.
 * Max 1920px wide, WebP output, quality 80.
 */
export const processImage = async (filePath) => {
  const ext  = path.extname(filePath).toLowerCase();
  const tmp  = filePath + ".tmp.webp";

  try {
    await sharp(filePath)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(tmp);

    fs.renameSync(tmp, filePath);
  } catch (err) {
    // If sharp fails (corrupt file etc.) keep original
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    console.warn("processImage skipped:", err.message);
  }
};
