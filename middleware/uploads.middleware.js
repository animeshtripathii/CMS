import multer from 'multer';
import path from 'path';

/*storage configuration*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueName +  path.extname(file.originalname));
    }
});


/**file type validation */

   const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error("Only images or PDF files are allowed"), false);
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

export default upload;