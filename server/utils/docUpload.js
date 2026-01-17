const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');
const path = require('path');

// Configure Cloudinary storage for documents (raw files)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'gmt/documents', // Folder in Cloudinary
        resource_type: 'raw', // Important: 'raw' for non-image files
        allowed_formats: ['csv', 'xlsx', 'xls'],
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.csv' || ext === '.xlsx' || ext === '.xls') {
        cb(null, true);
    } else {
        cb(new Error('Only CSV, XLSX, and XLS files are allowed!'), false);
    }
};

const docUpload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: fileFilter
});

module.exports = docUpload;
