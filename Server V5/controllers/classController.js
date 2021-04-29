//Dependecies
const router = require('express').Router();
const classService = require('../services/classServices.js');

router.get('/', async(req, res) => {
    let result;

    // GET listing of all classs
    try {
        result = await classService.getClass();
        res.json(result);
        // Catch and send errors  
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});



// GET classes by userEmail
router.get('/user/:userEmail', async(req, res) => {

    let result;
    // read value of userEmail parameter from the request url
    const userEmail = req.params.userEmail;
    console.log("classController: ", userEmail);
    // If validation passed execute query and return results
    // returns classes by userEmail
    try {
        // Send response with JSON result    
        result = await classService.getClassByUserEmail(userEmail);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// GET classes by instructorId
router.get('/:instructorId', async(req, res) => {

    let result;
    // read value of id parameter from the request url
    const instructorsId = req.params.instructorId;
    console.log("classController: ", instructorsId);
    // If validation passed execute query and return results
    // returns classes by instructorId
    try {
        // Send response with JSON result    
        result = await classService.getClassByInstructorId(instructorsId);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// GET Pending classes by instructorId
router.get('/pending/:instructorId', async(req, res) => {

    let result;
    const instructorsId = req.params.instructorId;
    console.log("classController: Pending Class Of", instructorsId);
    // If validation passed execute query and return results
    // returns classes by instructorId
    try {
        // Send response with JSON result    
        result = await classService.getPendingClassByInstructorId(instructorsId);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});

// GET Pending classes by instructorId
router.get('/approved/:instructorId', async(req, res) => {

    let result;
    const instructorsId = req.params.instructorId;
    console.log("classController: Approved Class Of", instructorsId);
    // If validation passed execute query and return results
    // returns classes by instructorId
    try {
        // Send response with JSON result    
        result = await classService.getApprovedClassByInstructorId(instructorsId);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});



// POST - Insert a new class.
// This async function sends a HTTP POST request
router.post('/', async(req, res) => {

    // the request body contains the new class values - copy it
    const newClass = req.body;

    // show what was copied in the console (server side)
    console.log("classController: ", newClass);

    // Pass the new class data to the service and await the result
    try {
        // Send response with JSON result    
        result = await classService.createClass(newClass);

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
    const classId = req.params.id;
    // If validation passed execute query and return results
    // returns a single class with matching id
    try {
        // Send response with JSON result    
        result = await classService.deleteClass(classId);
        res.json(result);

    } catch (err) {
        res.status(500);
        console.log(err.message);
        res.send(err.message);
    }
});

// PUT update approve class
router.put('/approve/:id', async(req, res) => {


    let result;
    // read value of id parameter from the request url
    const classId = req.params.id;
    // show what was copied in the console (server side)
    console.log("classController update: ", classId);

    // Pass the new membership data to the service and await the result
    try {
        // Send response with JSON result    
        result = await classService.approveClass(classId);

        // send a json response back to the client
        res.json(result);

        // handle server (status 500) errors
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});


// Export as a module
module.exports = router;