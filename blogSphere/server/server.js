const express = require("express");
const cors = require("cors");
// console.log("__dirname:", __dirname);
require("dotenv").config({ path: __dirname + "/.env" });
// console.log("MONGO_URI:", process.env.MONGO_URI);
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");



const app = express();
connectDB();
app.use(cors());
app.use(express.json());

//Authentication Routes

app.use("/api/auth", authRoutes);

app.use("/api/blog", blogRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/user", userRoutes);

app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
    res.send("API Running");
});





// app.get("/protected",authMiddleware,(req,res)=>{

//     res.json({message:"Protected route accessed",user:req.user});

// }
// );


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});