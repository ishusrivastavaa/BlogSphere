const User = require("../models/User");
const Blog = require("../models/Blog");

// Get All User
const getAllUser = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Delete USer
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await Blog.deleteMany({ author: req.params.id });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted Successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Block / Unblock User
const toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.status(200).json({ message: user.isBlocked ? "User Blocked Successfuly" : "User unBlocked Successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get All blog
const getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find().populate("author", "name email").sort({ createdAt: -1 });
        res.status(200).json(blogs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Delete any Blog
const deleteAnyBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not Found" });
        }
        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Blog Deleted Successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllUser, deleteUser, toggleBlockUser, getAllBlogsAdmin, deleteAnyBlog };