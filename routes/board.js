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
    const {user, title, content} = req.body;
    const last_board = await Boards.findOne().sort("-boardId").exec() // 있으면 {}, 없으면 null
    let boardId = 0;

    if (last_board) {
        boardId = last_board["boardId"] + 1;
    } else {
        boardId = 1;
    }

    const createdBoard = await Boards.create({boardId, user, title, content})   // {} 형태.
    res.json({message: "성공적으로 등록이 완료되었음"})
})

// 경로 : localhost:3000/boards/:boardId    특정 게시글의 상세 사항을 보여줌. 댓글이 있을 경우 댓글도 함께.
router.get("/:boardId", async (req, res) => {
    const boardId = Number(req.params["boardId"]);   // Number() 를 사용했는데 문자열이 숫자가 아닌 글자다? NaN 반환. 

    if (Number.isNaN(boardId)) {
        return res.status(400).send({success: false, message:"잘못된 ID 입니다"});
    }

    const getBoard = await Boards.findOne({boardId})       // [{}]  findOne() 이라면 {}. 만약 없다면 null
    const getComments = await Comments.find({boardId}); // 만약 없다면 [] 이렇게 빈 배열.
                                                        // 찾는 값이 문자든 숫자든 상관 없어.
    const result = {};

    if (getBoard === null || getBoard === undefined) {
        return res.status(400).json({success: false, message: "존재하지 않는 게시글입니다."})
    } else {
        result["board"] = getBoard
    }
    if (getComments.length) {
        result["comments"] = getComments
    }

    res.json({success: true, result: result});
})

// 경로 : localhost:3000/boards/:boardId        특정 게시글을 수정. params 와 body 를 같이 받는다.
router.put('/:boardId', async (req, res) => {
    const {boardId} = req.params;
    const {title, content} = req.body;
    const getBoard = await Boards.find({boardId})   
                                // 있다면 [{}], 없다면 [].      findOne() 은 있다면 {}, 없다면 null

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