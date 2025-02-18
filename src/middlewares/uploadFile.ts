import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to accept only certain file types (optional)
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "video/mp4",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
