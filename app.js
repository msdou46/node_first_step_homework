const express = require('express');    
const app = express();   
const port = 3000;

// route 가져오기
const boardsRouter = require("./routes/board.js")
const commentsRouter = require("./routes/comment.js")
const connect = require("./schemas")
connect();  // 몽고DB 커넥트 시도 및 실행.

// req.body 및 routes 를 use 하기.
app.use(express.json());
app.use("/posts", [boardsRouter]);
app.use("/comments", [commentsRouter]);


app.get('/', (req, res) => {
    res.send("Hello World! I'm 김민수B(노드4기)");
});

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});
