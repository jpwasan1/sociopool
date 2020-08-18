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
        let from_date = queryParams.from_date;
        let to_date = queryParams.to_date;
        let getDistanceTravelledInGivenDurationQuery = `SELECT sum(distance) as sum FROM DISTANCE_TRAVELLED
        WHERE (from_date >= '${from_date}' AND to_date <= '${to_date}') and person_id=?;`;
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
       


    

        let personExistQuery = `SELECT COUNT(*) as duplicate FROM  DISTANCE_TRAVELLED WHERE PERSON_ID=? AND PERSON_NAME=?;`
        let personExistQueryResult = await runQuery(personExistQuery, [body.person_id, body.person_name]);
        console.log(personExistQueryResult.length,'personExistQueryResult.length');
        console.log(personExistQueryResult[0].DUPLICATE,'personExistQueryResult[0].DUPLICATE');


        let selectPersonNameQuery = `SELECT person_id FROM DISTANCE_TRAVELLED where person_name = ?`;
        let selectPersonNameQueryResult = await runQuery(selectPersonNameQuery,[body.person_name]);
        console.log(selectPersonNameQueryResult,'selectPersonNameQueryResult');
        console.log(selectPersonNameQueryResult.length,'selectPersonNameQueryResult.length');
        

      

        if (personExistQueryResult[0].DUPLICATE != 0) {
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
        else if(selectPersonNameQueryResult.length < 1 ) {
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
        else{
            
                return res.status(400).send({ message: 'person id is unique' });
            
        }
    }
    catch (error) {
  
        console.trace(error);
        let newError = new Error('Something went wrong!');
        next(newError);
    }
});

module.exports = router;
