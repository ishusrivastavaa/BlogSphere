const multer = require("multer");
const path = require("path");


// BLOG IMAGE STORAGE

const blogStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/blogs");
    },

    filename: function (req, file, cb) {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});


// PROFILE IMAGE STORAGE

const profileStorage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/profiles");

    },

    filename: function (req, file, cb) {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});


// MULTER MIDDLEWARES

const uploadBlogImage = multer({

    storage: blogStorage

});

const uploadProfileImage = multer({

    storage: profileStorage

});


// EXPORTS

module.exports = { uploadBlogImage, uploadProfileImage };