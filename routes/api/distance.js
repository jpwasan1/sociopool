const { runQuery, checkIsExistInDb } = require('./../../config/functions');
const express = require('express');
let router = express.Router();
const _ = require('lodash');
 



router.get('/', async (req, res, next) => {
    try {
        let queryParams = null;
        
        if (req.headers.query) {
            queryParams = JSON.parse(req.headers.query);
        }

        if (queryParams && !/^\d+$/.test(queryParams.personId)) {
            return res.status(400).send({ message: 'Invalid Entry' });
        }
        let personId = queryParams.personId;
        let getDistanceTravelledInGivenDurationQuery = `SELECT * FROM DISTANCE_TRAVELLED
        WHERE (from_date >= '2020-08-06 13:30:44' AND to_date <= '2020-08-06 14:30:44') and person_id=?;`;
        let getDistanceTravelledInGivenDurationQueryResult = await runQuery(getDistanceTravelledInGivenDurationQuery, [personId]);


        res.status(200).send(getDistanceTravelledInGivenDurationQueryResult);
    }
    catch (error) {
        console.trace(error);
        let newError = new Error('Something went wrong!');
        next(newError);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let body = null;
        body = _.pick(req.body, ['person_name', 'person_id', 'distance','from_date','to_date']);

        

        if (!body.person_id) return res.status(400).send({ message: 'Missing Entity' });
        if (body && !/^\d+$/.test(body.person_id)) {
            return res.status(400).send({ message: 'Invalid Entry' });
        }
       


    

        let distanceExistQuery = `SELECT COUNT(*) as duplicate FROM  DISTANCE_TRAVELLED WHERE PERSON_ID=? AND ISVISIBLE='Y';`
        let distanceExistQueryResult = await runQuery(distanceExistQuery, [body.person_id]);
        console.log(distanceExistQueryResult.length,'distanceExistQueryResult.length');
        console.log(distanceExistQueryResult[0].DUPLICATE,'distanceExistQueryResult[0].DUPLICATE');
        

      

        if (distanceExistQueryResult[0].DUPLICATE == 0) {
            let keysArr = [];
            let valuesArr = [];
            let queMarks = [];
            for (let key in body) {
                keysArr.push(key);
                valuesArr.push(body[key]);
                queMarks.push('?');
            }
           

            let postDistanceQuery = `SELECT * FROM FINAL TABLE (INSERT INTO DISTANCE_TRAVELLED (${keysArr.toString()}) VALUES (${queMarks.toString()}));`;
            let postDistanceQueryResult = await runQuery(postDistanceQuery, [...valuesArr]);
            return res.status(200).send(postDistanceQueryResult);
        }
        else {
            return res.status(400).send({ message: 'distance already exists for the person' });
        }
    }
    catch (error) {
  
        console.trace(error);
        let newError = new Error('Something went wrong!');
        next(newError);
    }
});

module.exports = router;
