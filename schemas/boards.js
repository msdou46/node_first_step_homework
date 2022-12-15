const mongoose = require("mongoose")

const boardsSchema = new mongoose.Schema({
    boardId: {
        type: Number,
        required: true,
        unique: true
    },
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("boards", boardsSchema);