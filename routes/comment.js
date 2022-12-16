const express = require('express')
const router = express.Router();

// schema
const Posts = require("../schemas/posts.js")
const Comments = require("../schemas/comments.js")


// 미들웨어
router.use("/:postId/comments/:commentId", async (req, res, next) => {
    // const method_type = req.method;

    const commentId = Number(req.params["commentId"]);   // Number() 를 사용했는데 문자열이 숫자가 아닌 글자다? NaN 반환. 
    if (Number.isNaN(commentId)) {
        return res.status(400).send({success: false, message:"데이터 형식이 올바르지 않습니다."});
    } 
    next();
})



/* -------------------------- 댓글 작성, 수정, 삭제 -------------------------- */

// 경로 : localhost:3000/posts/:postId/comments     해당 게시글에 댓글 달기. 해당 api 는 params 와 body 를 다 받는다.
router.post("/:postId/comments", async (req, res) => {
    const {postId} = req.params;
    const {user, content} = req.body;
    const existPost = await Posts.find({postId})

    if (!existPost.length) {
        return res.status(404).json({success: false, erorrMessage: "해당 게시글은 존재하지 않습니다."})
    }

    const last_comment = await Comments.findOne().sort("-commentId").exec()
    let commentId = 0;

    if (last_comment) {
        commentId = last_comment["commentId"] + 1
    } else {
        commentId = 1;
    }

    const createdComment = await Comments.create({commentId, user, content, postId});     // {}

    res.status(200).json({success: true, result: createdComment, message:"댓글을 생성하였습니다."})
})

// 경로 : localhost:3000/posts/:postId/comments/:commentId        해당 댓글 수정
router.put('/:postId/comments/:commentId', async (req, res) => {
    const {postId} = req.params;
    const {commentId} = req.params;
    const {content} = req.body;
    const existComment = await Comments.find({commentId, postId})

    if (!content) {
        return res.status(400).json({success: false, erorrMessage: "수정할 댓글 내용을 입력해 주세요."})
    }

    if (!existComment.length) {
        return res.status(404).json({success: false, erorrMessage: "해당 댓글은 존재하지 않습니다."})
    } else {
        await Comments.updateOne({commentId: commentId}, {$set: {content: content}})
    }

    res.status(200).json({success: true, message:"댓글을 수정하였습니다."})
})

// 경로 : localhost:3000/posts/:postId/comments/:commentId        해당 댓글 삭제
router.delete("/:postId/comments/:commentId", async (req, res) => {
    const {postId} = req.params;
    const {commentId} = req.params;
    const existComment = await Comments.find({commentId, postId})   // 있으면 [{}],  없으면 []

    if (!existComment.length) {
        return res.status(404).json({success: false, erorrMessage: "해당 댓글은 존재하지 않습니다."})
    } else {
        await Comments.deleteOne({commentId})
    }

    res.json({success: true, message: "댓글을 삭제하였습니다."})
})



module.exports = router;