const express = require('express');
const mysql = require('../tool/pool');
const router = express.Router();
const path = require('path');


router.post('/evaluation', async (req, res) => {
    const elec_id = req.body.election_id;
    const elec_code = req.body.election_code;
    const cand_name = req.body.cand_name;
    const content = req.body.content;
    const user_id = req.session.userData[0].user_id;

    const query = `insert into evaluation
    values((select candidate_id 
    from candidate 
    where election_id = ?
    and election_code = ?
    and name = ?),?, ?, ?,?);`;
    const values = [elec_id, elec_code, cand_name, elec_id, elec_code, user_id, content];

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