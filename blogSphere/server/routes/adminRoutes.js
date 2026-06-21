const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const {

    getAllUser,

    deleteUser,

    toggleBlockUser,

    getAllBlogsAdmin,

    deleteAnyBlog

} = require("../controllers/adminController");




// GET ALL USERS

router.get("/users", authMiddleware, adminMiddleware, getAllUser);




// DELETE USER

router.delete("/delete-user/:id", authMiddleware, adminMiddleware, deleteUser);




// BLOCK / UNBLOCK USER

router.put("/toggle-block/:id", authMiddleware, adminMiddleware, toggleBlockUser);




// GET ALL BLOGS

router.get("/blogs", authMiddleware, adminMiddleware, getAllBlogsAdmin);




// DELETE ANY BLOG

router.delete("/delete-blog/:id", authMiddleware, adminMiddleware, deleteAnyBlog);




module.exports = router;