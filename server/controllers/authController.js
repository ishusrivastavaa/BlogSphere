const User = require("../models/User");
const bcrypt = require("bcryptjs");

const generateToken = require("../utils/generateToken");

// Register User
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            email,
            password: hashedPassword

        });


        res.status(201).json({ message: "User Registered Successfully", user });

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

};

//Login User

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid Password" });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: "User Blocked" });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            message: "Login Successfull",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
        )


    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
module.exports = { loginUser, registerUser };