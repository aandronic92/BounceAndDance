//Dependecies
const router = require('express').Router();
const membershipService = require('../services/membershipServices.js');

router.get('/', async(req, res) => {
    let result;

    // GET listing of all memberships
    try {
        result = await membershipService.getMemberships();
        res.json(result);
        // Catch and send errors  
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// GET a single membership by id
router.get('/:id', async(req, res) => {

    let result;
    // read value of id parameter from the request url
    const membershipId = req.params.id;

    // If validation passed execute query and return results
    // returns a single membership with matching id
    try {
        // Send response with JSON result    
        result = await membershipService.getMembershipById(membershipId);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// POST - Insert a new membership.
// This async function sends a HTTP POST request
router.post('/', async(req, res) => {

    // the request body contains the new membership values - copy it
    const newMembership = req.body;

    // show what was copied in the console (server side)
    console.log("membershipController: ", newMembership);

    // Pass the new membership data to the service and await the result
    try {
        // Send response with JSON result    
        result = await membershipService.createMembership(newMembership);

        // send a json response back to the client
        res.json(result);

        // handle server (status 500) errors
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

// PUT update membership
// Like post but membershipId is provided and method = put
router.put('/', async(req, res) => {

    // the request body contains the new membership values - copy it
    const membership = req.body;

    // show what was copied in the console (server side)
    console.log("membershipController update: ", membership);

    // Pass the new membership data to the service and await the result
    try {
        // Send response with JSON result    
        result = await membershipService.updateMembership(membership);

        // send a json response back to the client
        res.json(result);

        // handle server (status 500) errors
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

// DELETE single task.
router.delete('/:id', async(req, res) => {

    let result;
    // read value of id parameter from the request url
    const membershipId = req.params.id;
    // If validation passed execute query and return results
    // returns a single membership with matching id
    try {
        // Send response with JSON result    
        result = await membershipService.deleteMembership(membershipId);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// Export as a module
module.exports = router;