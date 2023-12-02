const express = require('express');
const getConnection = require('../middleware/pool');
const router = express.Router();
const path = require('path');


router.post('/election',async (req,res)=>{
    const query = `select *
    from election
    where election_code = ?
    and election_id in (select election_id
    from election
    where election_name = ?);`;
    
    let elec1 = req.body.select1;
    let elec2 = req.body.select2;

    let resData = {
        elecData:{

        },
        candData:[

        ]
        
    }

    switch (elec1) {
        case '대통령선거':
            elec1 = 1;
            break;
        case '국회의원선거':
            elec1 = 2;
            break;
        case '시·도지사선거':
            elec1 = 3;
            break;
        case '구·시·군의장선거':
            elec1 = 4;
            break;
        case '시·도의회의원선거':
            elec1 = 5;
            break;
        case '구·시·군의회의원선거':
            elec1 = 6;
            break;
        case '비례대표국회의원선거':
            elec1 = 7;
            break;
        case '광역의원비례대표선거':
            elec1 = 8;
            break;
        case '기초의원비례대표선거':
            elec1 = 9;
            break;
        case '교육의원선거':
            elec1 = 10;
            break;
        case '교육감선거':
            elec1 = 11;
            break;
    }

    const values = [elec1, elec2];

    
    getConnection((conn)=>{
        conn.query(query, values, (err,result)=>{
            if(err){
                console.log(`Error: ${err}`);
                return;
            }
            resData.elecData = result[0];
            console.log(resData);

        })

        let query2 = `select c1.name, c1.party, c1.gender, c1.edu, c1.birth_date, c2.career
        from candidate as c1, career as c2
        where c1.election_id = ?
        and c1.election_code = ?
        and c1.candidate_id = c2.candidate_id;`
        let values2 = [resData.elecData.election_id, resData.elecData.election_code];
        conn.query(query2, values2, (err,result)=>{
            conn.release();
            if(err){
                console.log(`Error: ${err}`);
                return;
            }
            resData.candData = result;

        })

        conn.release();
        
    })
});


module.exports = router;