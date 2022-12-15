const express = require('express')
const router = express.Router();

// schema
const Boards = require("../schemas/boards.js")
const Comments = require("../schemas/comments.js")


// 경로 : localhost:3000/comments
router.get("/", async (req, res) => {
    res.json({});
})


// 경로 : localhost:3000/comments/:boardId         해당 게시글에 댓글 달기. 해당 api 는 params 와 body 를 다 받는다.
router.post("/:boardId", async (req, res) => {
    const {boardId} = req.params;
    const {user, content} = req.body;
    const existBoard = await Boards.find({boardId})

    if (!existBoard.length) {
        return res.status(400).json({success: false, erorrMessage: "해당 게시글은 존재하지 않습니다."})
    }

    const last_comment = await Comments.findOne().sort("-commentId").exec()
    let commentId = 0;

    if (last_comment) {
        commentId = last_comment["commentId"]
    } else {
        commentId = 1;
    }

    const createdComment = await Comments.create({commentId, user, content, boardId});     // {}

    res.status(200).json({success: true, comment: createdComment})
})

// 경로 : localhost:3000/comments/:commentId        해당 댓글 수정
router.put('/:commentId', async (req, res) => {
    const {commentId} = req.params;
    const {content} = req.body;
    
    const existComment = await Comments.find({commentId})

    if (existComment.length) {
        await Comments.updateOne({commentId: commentId}, {$set: {content: content}})
    }

    res.status(200).json({success: true})
})

// 경로 : localhost:3000/comments/:commentId        해당 댓글 삭제
router.delete("/:commentId", async (req, res) => {
    const {commentId} = req.params;
    const existComment = await Comments.find({commentId})

    if (existComment.length) {
        await Comments.deleteOne({commentId})
    }

    res.json({success: true})
})



module.exports = router;