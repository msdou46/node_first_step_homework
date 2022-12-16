const express = require('express')
const router = express.Router();

// schema
const Posts = require("../schemas/posts.js")
const Comments = require("../schemas/comments.js")

// 경로 : localhost:3000/posts         등록된 board 들을 모두 보여줌. 간략하게 리스트로.
router.get("/", async (req, res) => {
    const getPosts = await Posts.find({});
    const result = getPosts.map((item) => {
        return {
            postId: item["postId"],
            user: item["user"],
            title: item["title"],
            content: item["content"]
        }
    });

    res.status(200).json({PostsList: result});
})

// 경로 : localhost:3000/posts         계시글을 입력받아 DB에 저장
router.post("/", async (req, res) => {
    const {user, title, content} = req.body;
    const last_board = await Posts.findOne().sort("-postId").exec() // 있으면 {}, 없으면 null
    let postId = 0;

    if (!user || !title || !content) {  // 비어있으면 '', 아예 들어오지 않았다면 undefined. 둘 다 false.
        return res.status(400).json({success: false, message:"데이터 형식이 올바르지 않습니다."})
    }

    if (last_board) {
        postId = last_board["postId"] + 1;
    } else {
        postId = 1;
    }

    const createdBoard = await Posts.create({postId, user, title, content})   // {} 형태.
    res.json({success: true, message: "게시글을 등록하였습니다."})
})




/* -------------------------- 게시글 상세 조회, 수정, 삭제 -------------------------- */

// 미들 웨어. postId params 를 잘못 입력 받은 경우.
router.use("/:postId", (req, res, next) => {
    const postId = Number(req.params["postId"]);   // Number() 를 사용했는데 문자열이 숫자가 아닌 글자다? NaN 반환. 
    if (Number.isNaN(postId)) {
        return res.status(400).send({success: false, message:"데이터 형식이 올바르지 않습니다."});
    }
    next();
})

// 경로 : localhost:3000/posts/:postId    특정 게시글의 상세 사항을 보여줌. 댓글이 있을 경우 댓글도 함께.
router.get("/:postId", async (req, res) => {
    const {postId} = req.params;   
    const getBoard = await Posts.findOne({postId})       // [{}]  findOne() 이라면 {}. 만약 없다면 null
    const getComments = await Comments.find({postId}); // 만약 없다면 [] 이렇게 빈 배열.
                                        // 찾는 값이 문자든 숫자든 상관 없더라. 넘나 늦게 깨달은 것....
    const result = {};

    if (getBoard === null || getBoard === undefined) {
        return res.status(404).json({success: false, message: "존재하지 않는 게시글입니다."})
    } else {
        result["board"] = getBoard
    }
    if (getComments.length) {
        result["comments"] = getComments
    }
    res.json({success: true, result: result});
})

// 경로 : localhost:3000/posts/:postId        특정 게시글을 수정. params 와 body 를 같이 받는다.
router.put('/:postId', async (req, res) => {
    const {postId} = req.params;
    const {title, content} = req.body;
    const getBoard = await Posts.find({postId})   
                                // 있다면 [{}], 없다면 [].      findOne() 은 있다면 {}, 없다면 null
    if (!title || !content) {
        return res.status(400).json({success: false, message:"데이터 형식이 올바르지 않습니다."})
    }

    if (!getBoard.length) {
        return res.status(404).json({success: false, message:"수정 하시려는 게시글은 존재하지 않는 게시글입니다."})
    } else {
        await Posts.updateOne({postId: postId}, {$set: {title: title, content: content}});
    }
    res.status(200).json({success: true, message:"게시글을 수정 하였습니다"})
})

// 경로 : localhost:3000/posts/:postId       특정 게시물을 삭제. 게시물에 달린 댓글도 삭제.
router.delete("/:postId", async (req, res) => {
    const {postId} = req.params;
    const existBoard = await Posts.find({postId})

    if (!existBoard.length) {
        return res.status(404).json({success: false, message:"삭제 하시려는 게시글은 존재하지 않는 게시글입니다."})
    } else {
        await Posts.deleteOne({postId})
        await Comments.deleteMany({postId})
    }

    res.status(200).json({success: true, message:"게시글을 삭제 하였습니다"})
})



module.exports = router;