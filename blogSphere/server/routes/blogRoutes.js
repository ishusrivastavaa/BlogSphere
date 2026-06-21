const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { uploadBlogImage } = require("../middleware/uploadMiddleware");

const { createBlog, getAllBlog, getSingleBlog, updateBlog, deleteBlog } = require("../controllers/blogController");

router.post("/create", authMiddleware, uploadBlogImage.single("image"), createBlog);
router.get("/all", getAllBlog);
router.get("/:id", getSingleBlog);
router.put("/update/:id", authMiddleware, uploadBlogImage.single("image"), updateBlog);
router.delete("/delete/:id", authMiddleware, deleteBlog);



module.exports = router;