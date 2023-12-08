const express = require('express');
const mysql = require('../tool/pool');
const router = express.Router();
const path = require('path');


router.post('/evaluation', async (req, res) => {
    const elec_id = req.body.election_id;
    const elec_code = req.body.election_code;
    const cand_id = req.body.cand_id;
    const content = req.body.content;
    const user_id = req.session.userData[0].user_id;

    const query = `insert into evaluation
    values(?,?,?);`;
    const values = [cand_id, user_id, content];

    console.log(values);

    try {
        const connection = await mysql.getConnection();
        const result = await connection.query(query, values);

        console.log(result);
        res.json({
            success: true,
        });
        
        connection.release();

    }
    catch (err) {
        res.json({
            success: false,
        });
        
        console.log(err);
        return;
    }

})



module.exports = router;