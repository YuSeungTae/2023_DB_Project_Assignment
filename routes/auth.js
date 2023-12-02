const express = require('express');
const mysql= require('../middleware/pool');
const router = express.Router();
const path = require('path');



// 로그인
router.post('/login', async (req, res) => {

  const { userId, password } = req.body;
  const query =  `select *
  from assignment_db.user
  where user_id = ?
  and password = ? ;`;
  const values = [userId, password];

  try{
    const connection = await mysql.getConnection();

    const result = await connection.query(query,values);
    if(result[0].length === 0){
      connection.release();
      res.writeHead(200,{'Content-Type': 'text/html;charset="utf-8"'});
      res.write(`<script>alert('아이디 또는 비밀먼호를 확인해주세요.')</script>`);
      res.write("<script>window.location=\"/\"</script>");
      return;
    }
    connection.release();
    res.sendFile(path.join(__dirname,`../public/html/main.html`));


  }
  catch (err){
    connection.release();
    console.log(`Error: ${err}`);
    res.writeHead(200,{'Content-Type': 'text/html;charset="utf-8"'});
    res.write(`<script>alert('아이디 또는 비밀먼호를 확인해주세요.')</script>`);
    res.write("<script>window.location=\"/\"</script>");
    return;

  }

})


// 회원가입
router.post('/signup', async (req, res) => {
  const { newUserId, newPassword, gender, address } = req.body;
  const query = `insert into assignment_db.user values (?,?,?,?);`;
  const values = [newUserId, newPassword, address, gender];

  try{
    const connection = await mysql.getConnection();
    const result = await connection.query(query,values);

    console.log(result);
    res.writeHead(200,{'Content-Type': 'text/html;charset="utf-8"'});
    res.write(`<script>alert('회원가입이 완료되었습니다.')</script>`);
    res.write("<script>window.location=\"/\"</script>");
    connection.release();
  }
  catch(err){
    connection.release();
    console.log(`Error: ${err}`);
    res.writeHead(200,{'Content-Type': 'text/html;charset="utf-8"'});
    res.write(`<script>alert('중복된 계정입니다.')</script>`);
    res.write("<script>window.location=\"/\"</script>");
    return;

  }

  
})


module.exports = router;