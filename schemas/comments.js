const mongoose = require("mongoose")

const commentsSchema = new mongoose.Schema({
    commentId: {
        type: Number,
        required: true,
        unique: true
    },
    user: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    boardId: {
        type: Number,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("comments", commentsSchema);