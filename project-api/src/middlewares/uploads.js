import sharp from "sharp";
import multer from "multer";
import path from "path";

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // max 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      console.log("Upload: ", cb);
      cb(null, true);
    } else {
      const error = new Error("Only images and videos are allowed!");
      error.status = 400;
      cb(error, false);
    }
  },
});

const createCardIMG = async (req, res, next) => {
  if (!req.file) {
    console.log("No file");
    return next();
  }
  console.log(req.file.path);
  const originalPath = req.file.path;
  const thumbPath = originalPath + "_card.webp";

  console.log(thumbPath);

  await sharp(originalPath)
    .resize(160, 160, { fit: "cover" })
    .toFormat("webp")
    .toFile(thumbPath);

  req.body.filename = path.basename(thumbPath);

  next();
};

export { upload, createCardIMG };
