const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Allowed MIME types
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

// MIME Type Validation Filter
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG and WEBP images are allowed"), false);
    }
};

// File Size Limit (5 MB)
const limits = {
    fileSize: 5 * 1024 * 1024
};

// BLOG IMAGE STORAGE
const blogStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/blogs");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4();
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${uniqueSuffix}${extension}`);
    }
});

// PROFILE IMAGE STORAGE
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/profiles");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4();
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${uniqueSuffix}${extension}`);
    }
});

// Helper function to create Multer instance with built-in error handling
const createUploadMiddleware = (storage) => {
    const upload = multer({
        storage,
        fileFilter,
        limits
    });

    return {
        single: (fieldName) => (req, res, next) => {
            upload.single(fieldName)(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    if (err.code === "LIMIT_FILE_SIZE") {
                        return res.status(400).json({ message: "File size should not exceed 5MB" });
                    }
                    return res.status(400).json({ message: err.message });
                } else if (err) {
                    return res.status(400).json({ message: err.message });
                }
                next();
            });
        },
        array: (fieldName, maxCount) => (req, res, next) => {
            upload.array(fieldName, maxCount)(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    if (err.code === "LIMIT_FILE_SIZE") {
                        return res.status(400).json({ message: "File size should not exceed 5MB" });
                    }
                    return res.status(400).json({ message: err.message });
                } else if (err) {
                    return res.status(400).json({ message: err.message });
                }
                next();
            });
        },
        fields: upload.fields.bind(upload),
        none: upload.none.bind(upload),
        any: upload.any.bind(upload)
    };
};

// MULTER MIDDLEWARES
const uploadBlogImage = createUploadMiddleware(blogStorage);
const uploadProfileImage = createUploadMiddleware(profileStorage);

// Exports
module.exports = { uploadBlogImage, uploadProfileImage };