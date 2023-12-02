const express = require('express');
const mysql = require('../middleware/pool');
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

    try{
        const connection = await mysql.getConnection();
        const result = await connection.query(query,values);
        resData.elecData = result[0];
        connection.release();
    }
    catch (err) {
        connection.release();
        console.log(`Error: ${err}`);
        return;

    }


    try{
        let query2 = `select c1.name, c1.party, c1.gender, c1.edu, c1.birth_date, c2.career
        from candidate as c1, career as c2
        where c1.election_id = ?
        and c1.election_code = ?
        and c1.candidate_id = c2.candidate_id;`

        let values2 = [resData.elecData[0].election_id, resData.elecData[0].election_code];
        const connection = await mysql.getConnection();
        const result = await connection.query(query2,values2);
        resData.candData = result[0];
        connection.release();


        const combinedCandData = resData.candData.reduce((acc, candidate) => {
            const existingCandidate = acc.find((c) => c.name === candidate.name);
          
            if (existingCandidate) {
              // If candidate with the same name exists, combine careers
              existingCandidate.career += ' / ' + candidate.career;
            } else {
              // If candidate with a unique name, add to the accumulator
              acc.push(candidate);
            }
          
            return acc;
          }, []);
          
          // Update resData with the combined candidate data
          resData.candData = combinedCandData

          res.json(resData);


    }
    catch (err){
        connection.release();
        console.log(`Error: ${err}`);
        return;
    }

    

        
});


module.exports = router;