import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cvs/"); // Save files in uploads/cvs/
  },
  filename: (req, file, cb) => {
    if (!req.session || !req.session.user) {
      return cb(new Error("Unauthorized"), null);
    }
    console.log("Checking the name ===>",req.session.user.name)
    const username = req.session.user.name.replace(/\s+/g, "_"); // Replace spaces with underscores
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, `${username}-cv${ext}`); // Format: "Bilawal_Zaman-cv.pdf"
  },
});

// File filter (only PDFs & DOCX allowed)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF or DOCX files allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
