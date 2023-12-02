const express = require('express');
const getConnection = require('../middleware/pool');
const router = express.Router();
const path = require('path');



// 로그인
router.post('/login', (req, res) => {
  const { userId, password } = req.body;
  const query =  `select *
  from assignment_db.user
  where user_id = ?
  and password = ? ;`;
  const values = [userId, password]

  getConnection((conn)=>{
    conn.query(query, values, (err,result)=>{
      conn.release();

      // 로그인 실패
      if(err){
        console.log(`Error: ${err}`);
        res.writeHead(200,{'Content-Type': 'text/html;charset="utf-8"'});
        res.write(`<script>alert('아이디 또는 비밀먼호를 확인해주세요.')</script>`);
        res.write("<script>window.location=\"/\"</script>");
        return;
      }

      console.log(result[0]);
      // 계정 없음.
      if(result[0] == undefined){
        res.writeHead(200,{'Content-Type': 'text/html;charset="utf-8"'});
        res.write(`<script>alert('아이디 또는 비밀먼호를 확인해주세요.')</script>`);
        res.write("<script>window.location=\"/\"</script>");
        return;
      }

      // 로그인 성공
      req.session.user = result;
      res.sendFile(path.join(__dirname,`../public/html/main.html`));

    })
  })
});


// 회원가입
router.post('/signup', (req, res) => {
  const { newUserId, newPassword, gender, address } = req.body;
  const query = `insert into assignment_db.user values (?,?,?,?);`;
  const values = [newUserId, newPassword, address, gender];

  getConnection((conn)=>{
    conn.query(query, values, (err,result)=>{
      conn.release();
      res.writeHead(200,{'Content-Type': 'text/html;charset="utf-8"'});

      // 회원가입 실패
      if(err){
        console.log(`Error: ${err}`);
        res.write(`<script>alert('중복된 계정입니다.')</script>`);
        res.write("<script>window.location=\"/\"</script>");
        return;
      }

      // 회원가입 성공
      console.log(result);
      res.write(`<script>alert('회원가입이 완료되었습니다.')</script>`);
      res.write("<script>window.location=\"/\"</script>");
    })
  })
})


module.exports = router;