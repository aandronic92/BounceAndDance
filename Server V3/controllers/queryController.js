//Dependecies
const router = require('express').Router();
const queryService = require('../services/queryServices.js');

router.get('/', async(req, res) => {
    let result;

    // GET listing of all queries
    try {
        result = await queryService.getQueries();
        res.json(result);
        // Catch and send errors  
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// GET a single query by email
router.get('/:email', async(req, res) => {

    let result;
    // read value of email parameter from the request url
    const queryEmail = req.params.email;

    // If validation passed execute query and return results
    // returns a single query with matching id
    try {
        // Send response with JSON result    
        result = await queryService.getQueryByEmail(queryEmail);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// POST - Insert a new query.
// This async function sends a HTTP POST request
router.post('/', async(req, res) => {

    // the request body contains the new query values - copy it
    const newQuery = req.body;

    // show what was copied in the console (server side)
    console.log("queryController: ", newQuery);

    // Pass the new query data to the service and await the result
    try {
        // Send response with JSON result    
        result = await queryService.createQuery(newQuery);
        console.log(result);
        // send a json response back to the client
        res.json(result);

        // handle server (status 500) errors
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

// PUT update query
// Like post but queryId is provided and method = put
router.put('/', async(req, res) => {

    // the request body contains the new query values - copy it
    const query = req.body;

    // show what was copied in the console (server side)
    console.log("queryController update: ", query);

    // Pass the new query data to the service and await the result
    try {
        // Send response with JSON result    
        result = await queryService.updateQuery(query);

        // send a json response back to the client
        res.json(result);

        // handle server (status 500) errors
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

// DELETE single task.
router.delete('/:email', async(req, res) => {

    let result;
    // read value of id parameter from the request url
    const queryId = req.params.id;
    // If validation passed execute query and return results
    // returns a single query with matching id
    try {
        // Send response with JSON result    
        result = await queryService.deleteQuery(queryId);
        res.json(result);

    } catch (err) {
        res.status(500);
        console.log(err.message);
        res.send(err.message);
    }
});

// Export as a module
module.exports = router;