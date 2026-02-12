import multer from 'multer';
import path from 'path';

/* Upload kiye gaye files ke liye storage settings configure karein */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});


/** Upload ki gayi file ka MIME type validate karein */

   const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error("Only images or PDF files are allowed"), false);
    }
};
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // File size ko maximum 5 megabytes tak seemit karein
});

