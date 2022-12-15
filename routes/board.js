const express = require('express')
const router = express.Router();

// schema
const Boards = require("../schemas/boards.js")
const Comments = require("../schemas/comments.js")

// 경로 : localhost:3000/boards         등록된 board 들을 모두 보여줌. 간략하게 리스트로.
router.get("/", async (req, res) => {
    const getBoards = await Boards.find({});
    const result = getBoards.map((item) => {
        return {
            boardId: item["boardId"],
            user: item["user"],
            title: item["title"],
            content: item["content"]
        }
    });

    res.status(200).json({boardsList: result});
})

// 경로 : localhost:3000/boards         계시글을 입력받아 DB에 저장
router.post("/", async (req, res) => {
    const {boardId, user, title, content} = req.body;
    const checkId = await Boards.find({boardId});   // 있다면 [{}]

    if (checkId.length) {
        return res.status(400).json({success: false, errorMessage: "이미 존재하는 board_id 입니다"})
    }

    const createdBoard = await Boards.create({boardId, user, title, content})   // {} 형태.
    res.json({message: "성공적으로 등록이 완료되었음", result: createdBoard})
})

// 경로 : localhost:3000/boards/:boardId    특정 게시글의 상세 사항을 보여줌. 댓글이 있을 경우 댓글도 함께.
router.get("/:boardId", async (req, res) => {
    const {boardId} = req.params;

    if (Number.isNaN(boardId)) {
        return res.status(400).send({message:"잘못된 ID 입니다."})
    }
    
    const getBoard = await Boards.find({boardId})       // [{}]
    const getComments = await Comments.find({boardId}); // 만약 없다면 [] 이렇게 빈 배열.

    const result = {};

    if (getBoard.length) {
        result["board"] = getBoard[0]
    }
    if (getComments.length) {
        result["comments"] = getComments
    }

    res.json({success: true, result: result});
})

// 경로 : localhost:3000/boards/:boardId        특정 게시글을 수정
router.put('/:boardId', async (req, res) => {
    const {boardId} = req.params;
    const {title, content} = req.body;
    const getBoard = await Boards.find({boardId})   // 있다면 [{}], 없다면 []

    if (getBoard.length) {
        await Boards.updateOne({boardId: boardId}, {$set: {title: title, content: content}});
    }

    res.status(200).json({success: true})
})

// 경로 : localhost:3000/boards/:boardId       특정 게시물을 삭제. 게시물에 달린 댓글도 삭제.
router.delete("/:boardId", async (req, res) => {
    const {boardId} = req.params;
    const existBoard = await Boards.find({boardId})

    if (existBoard.length) {
        await Boards.deleteOne({boardId})
        await Comments.deleteMany({boardId})
    }

    res.status(200).json({success: true})
})



module.exports = router;