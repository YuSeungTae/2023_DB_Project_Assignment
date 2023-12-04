const express = require('express');
const mysql = require('../tool/pool');
const router = express.Router();
const path = require('path');
const parseString = require('xml2js').parseString;
const { find_elec_code } = require('../tool/find_elec_code');
const apiKey = require('../config/api_config.json');
var request = require('request');


router.post('/election', async (req, res) => {
    const query = `select *
    from election
    where election_code = ?
    and election_id in (select election_id
    from election
    where election_name = ?);`;

    let elec1 = req.body.select1;
    let elec2 = req.body.select2;

    let resData = {
        elecData: {},
        candData: []
    }
    elec1 = find_elec_code(elec1);


    const values = [elec1, elec2];

    try {
        const connection = await mysql.getConnection();
        const result = await connection.query(query, values);
        resData.elecData = result[0];
        connection.release();
    }
    catch (err) {
        connection.release();
        console.log(`Error: ${err}`);
        return;

    }


    try {
        let query2 = `select c1.name, c1.party, c1.gender, c1.edu, c1.birth_date, c2.career
        from candidate as c1, career as c2
        where c1.election_id = ?
        and c1.election_code = ?
        and c1.candidate_id = c2.candidate_id;`

        let values2 = [resData.elecData[0].election_id, resData.elecData[0].election_code];
        const connection = await mysql.getConnection();
        const result = await connection.query(query2, values2);
        resData.candData = result[0];
        connection.release();


        const combinedCandData = resData.candData.reduce((acc, candidate) => {
            const existingCandidate = acc.find((c) => c.name === candidate.name);

            if (existingCandidate) {
                existingCandidate.career += ' / ' + candidate.career;
            } else {
                acc.push(candidate);
            }

            return acc;
        }, []);

        resData.candData = combinedCandData

        console.log(resData)

        res.json(resData);


    }
    catch (err) {
        console.log(`Error: ${err}`);
        return;
    }
});


router.post('/pollingPlace', async (req, res) => {
    let elec_id = req.body.election_id;
    let elec_code = req.body.election_code;
    const addr = req.session.userData[0].address.split(' ');
    let addr1 = addr[0];
    let addr2 = addr[1];

    console.log(elec_id, elec_code, addr1, addr2);


    let resData = {
        placeData: []
    };

    var url = 'http://apis.data.go.kr/9760000/PolplcInfoInqireService2/getPolplcOtlnmapTrnsportInfoInqire';
    var queryParams = '?' + encodeURIComponent('serviceKey') + `=${apiKey.key}`; /* Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('200'); /* */
    queryParams += '&' + encodeURIComponent('sgId') + '=' + encodeURIComponent(`${elec_id}`); /* */
    queryParams += '&' + encodeURIComponent('sdName') + '=' + encodeURIComponent(`${addr1}`); /* */
    queryParams += '&' + encodeURIComponent('wiwName') + '=' + encodeURIComponent(`${addr2}`); /* */

    request({
        url: url + queryParams,
        method: 'GET'
    }, (error, response, body) => {
        parseString(body, { trim: true, explicitArray: false }, (err, result) => {
            if (err) {
                console.error(err);
                return;
            }

            if (!result || !result.response || !result.response.body || !result.response.body.items || !result.response.body.items.item) {
                console.error('Missing expected structure in the XML result');
                return;
            }
            
            const items = result.response.body.items.item;
            const filteredItems = items.map(item => {
                return {
                    name: item.psName,
                    placeName: item.placeName,
                    addr: item.addr
                };
            });
            resData.placeData = filteredItems;
            res.json(resData);
        });
    });


});


router.post('/evaluation', async (req, res) => {
    let elec_id = req.body.election_id;
    let elec_code = req.body.election_code;
    let cand_name = req.body.cand_name;


    const query = `select user_id, content
    from evaluation
    where election_id = ?
    and election_code = ?
    and candidate_id = (select candidate_id 
    from candidate 
    where election_id = ?
    and election_code = ?
    and name = ?);`

    const values = [elec_id, elec_code, elec_id, elec_code, cand_name];

    let resData = {
        evaData :{}
    }

    try {
        const connection = await mysql.getConnection();
        const result = await connection.query(query, values);
        resData.evaData = result[0];
        res.json(resData);
        console.log(resData);
        connection.release();
    }
    catch (err) {
        connection.release();
        console.log(`Error: ${err}`);
        return;

    }

    
});


module.exports = router;