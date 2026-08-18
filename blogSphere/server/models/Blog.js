const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    tags: [{
        type: String
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    {
        timestamps: true
    }
);

// Index for optimizing createdAt queries and sorting
blogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Blog", blogSchema);