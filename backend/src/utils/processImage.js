import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

/**
 * Compress + resize an uploaded image in-place.
 * Max 1920px wide, WebP output, quality 80.
 * Renames the file to .webp so the extension matches the content.
 * Returns the final file path (which may differ from the input path).
 */
export const processImage = async (filePath) => {
  const dir     = path.dirname(filePath);
  const base    = path.basename(filePath, path.extname(filePath));
  const webpPath = path.join(dir, `${base}.webp`);
  const tmp     = filePath + ".tmp.webp";

  try {
    await sharp(filePath)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(tmp);

    // Remove original (may have different extension)
    fs.unlinkSync(filePath);
    // Move temp to final .webp path
    fs.renameSync(tmp, webpPath);

    return webpPath;
  } catch (err) {
    // If sharp fails (corrupt file etc.) keep original unchanged
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    console.warn("processImage skipped:", err.message);
    return filePath; // fall back to original
  }
};
