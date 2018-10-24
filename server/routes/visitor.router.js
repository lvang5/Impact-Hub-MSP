const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


//POST route will login visitors to "checkin" 
//Required minimum req.body object format {name:'', visitor:true, purpose:''}
router.post('/', (req, res) => {
    if (req.isAuthenticated) {
        const visiCheckIn = req.body;
        console.log(visiCheckIn);
        const queryText = `INSERT INTO "checkin" ("name","visitor","purpose")
                            VALUES ($1, $2, $3);`;
        pool.query(queryText, [visiCheckIn.name, visiCheckIn.status, visiCheckIn.purpose])
            .then((results) => {
                res.sendStatus(200);
            }).catch((error) => {
                console.log('Visitor Checkin POST Failed', error);
                res.sendStatus(500);
            });
    } else {
        res.sendStatus(403);
    }
});

//PUT route will switch "checkin.checked-in" from 'true' to 'false'.
//Required minimum req.body object format {checkout:false, name:'', checked_in:true}
router.put('/', (req, res) => {
    if (req.isAuthenticated) {
        const visiCheckOut = req.body;
        //console.log(visiCheckOut); 
        const queryText = `UPDATE "checkin" SET "checked-in" = $1 
                            WHERE "checkin"."name" iLIKE $2 AND "checkin"."checked-in" = $3;`;
        pool.query(queryText, [visiCheckOut.checkout, visiCheckOut.name, visiCheckOut.checked_in])
            .then((results) => {
                res.sendStatus(200);
            }).catch((error) => {
                console.log('Visitor checkout failed', error);
                res.sendStatus(500);
            });
    } else {
        res.sendStatus(403);
    }
});

//Group login -- this post will add groups of visitors to the database
router.post('/group', (req, res) => {
    if (req.isAuthenticated) {
        const groupCheckIn = req.body;
        console.log(groupCheckIn);
        const queryText = `INSERT INTO "checkin" ("name", "quantity", "member", "visitor", "purpose", "checked_in")
                            VALUES ($1, $2, $3, $4, $5, $6);`;
        pool.query(queryText, [groupCheckIn.name, groupCheckIn.quantity, false, true, groupCheckIn.purpose, true])
            .then((results) => {
                res.sendStatus(200);
            }).catch((error) => {
                console.log('Visitor Checkin POST Failed', error);
                res.sendStatus(500);
            });
    } else {
        res.sendStatus(403);
    }
});

//GET route is for displaying the last five visitors who indicated they wanted info
router.get('/', (req, res)=>{
    if (req.isAuthenticated()){
        const queryText = `SELECT "name","phone", "email"
                            FROM "mailinglist"
                            WHERE "email" IS NOT NULL
                            LIMIT 5;`;
        pool.query(queryText)
            .then(response => res.send(response.rows))
            .catch(error => res.sendStatus(500));

    }else{
        res.sendStatus(401);
    }
});



module.exports = router;