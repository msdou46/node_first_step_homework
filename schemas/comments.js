const mongoose = require("mongoose")

const commentsSchema = new mongoose.Schema({
    commentId: {
        type: Number,
        required: true,
        unique: true
    },
    user: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    postId: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("comments", commentsSchema);

/* 
new Schema({ name: String }, { timestamps: true });

이런 식으로 2번째 인자로 timestamps 프로퍼티가 담긴 객체를 넣어주면 
mongoDB 에 도큐먼트가 insert 될 때 createdAt 과 updatedAt 을 함께 넣어줘. 최고네.
*/