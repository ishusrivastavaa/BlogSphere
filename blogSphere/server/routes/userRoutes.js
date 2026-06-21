const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { uploadProfileImage } = require("../middleware/uploadMiddleware");

const { getUserProfile, updateUserProfile, getMyBlogs } = require("../controllers/userController");




// GET PROFILE

router.get("/profile", authMiddleware, getUserProfile);




// UPDATE PROFILE

router.put("/update-profile", authMiddleware, uploadProfileImage.single("profileImage"), updateUserProfile);




// GET MY BLOGS

router.get("/my-blogs", authMiddleware, getMyBlogs);




module.exports = router;