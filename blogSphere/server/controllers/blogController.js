const Blog = require("../models/Blog");

// Create Blog
const createBlog = async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;

        console.log(req.file);
        console.log(req.body);

        const blog = await Blog.create({
            title,
            content,
            category,
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map(tag => tag.trim())) : [],
            image: req.file ? req.file.path.replace(/\\/g, "/") : "",
            author: req.user.id
        });

        res.status(201).json({
            message: "Blog Created",
            blog
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Blogs
const getAllBlog = async (req, res) => {
    try {

        const blogs = await Blog.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(blogs);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Blog
const getSingleBlog = async (req, res) => {
    try {

        const blog = await Blog.findById(req.params.id)
            .populate("author", "name email");

        if (!blog) {
            return res.status(404).json({
                message: "Blog not Found"
            });
        }

        res.status(200).json(blog);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Blog
const updateBlog = async (req, res) => {
    try {

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog Not Found"
            });
        }

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized Access"
            });
        }

        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.path.replace(/\\/g, "/");
        }
        if (req.body.tags) {
            updateData.tags = Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(",").map(tag => tag.trim());
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            message: "Blog Updated",
            updatedBlog
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Blog
const deleteBlog = async (req, res) => {
    try {

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog Not Found"
            });
        }

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized Access"
            });
        }

        await Blog.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Blog Deleted"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBlog,
    getAllBlog,
    getSingleBlog,
    updateBlog,
    deleteBlog
};