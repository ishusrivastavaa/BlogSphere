const User = require("../models/User");
const Blog = require("../models/Blog");


// GET LOGGED-IN USER PROFILE

const getUserProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        res.status(200).json(user);

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};




// UPDATE USER PROFILE

const updateUserProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        user.name = req.body.name || user.name;


        user.profileImage = req.file
            ? req.file.path.replace(/\\/g, "/")
            : user.profileImage;


        const updatedUser = await user.save();


        res.status(200).json({

            message: "Profile updated successfully",

            user: {

                id: updatedUser._id,

                name: updatedUser.name,

                email: updatedUser.email,

                profileImage: updatedUser.profileImage,

                role: updatedUser.role

            }

        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};




// GET MY BLOGS

const getMyBlogs = async (req, res) => {

    try {

        const blogs = await Blog.find({
            author: req.user.id
        }).sort({
            createdAt: -1
        });


        res.status(200).json(blogs);

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};




module.exports = {

    getUserProfile,

    updateUserProfile,

    getMyBlogs

};