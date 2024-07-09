// services/file-upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Set up storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads'); // Correct path
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
        }
        // Set the destination where files should be stored
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        // Rename the file to include the timestamp
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Filter files based on the type (optional)
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Initialize multer with the storage and file filter configuration
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
