const router = require('express').Router();
const userService = require('../services/userService.js');

// Auth0
const { authConfig, checkJwt, checkAuth } = require('../middleware/jwtAuth.js');

/* Hand get requests for '/'
/* this is the default rout
*/
router.get('/', function(req, res) {

    // set content type of response body in the headers
    res.setHeader('Content-Type', 'application/json');

    // Send a JSON response - this app will be a web api so no need to send HTML
    //res.end(JSON.stringify({message: 'This is the home page'}));
    res.json({ content: 'This is the default route - try /user/profile' });

});

// get user profile for authenticated user
// http://localhost:8585/user/profile
router.get('/profile', async(req, res) => {

    let userProfile;
    // Get memberships
    try {
        // Get info from user profile
        // if logged in (therefore access token exists)
        // get token from request
        if (req.headers['authorization']) {
            let token = req.headers['authorization'].replace('Bearer ', '');
            userProfile = await userService.getAuthUser(token);
            console.log("user email: ", userProfile.email);
        }

        res.json(userProfile);

        // Catch and send errors  
    } catch (err) {
        console.log(`ERROR getting user profile: ${err.message}`);
        res.status(500);
        res.send(err.message);
    }


});


// get user membership for authenticated user
router.get('/membership/:email', async(req, res) => {
    //alert();
    let result;
    // read value of id parameter from the request url
    const userEmail = req.params.email;

    // If validation passed execute query and return results
    // returns a single user with matching email and having membership
    try {
        // Send response with JSON result    
        result = await userService.checkMembershipEmail(userEmail);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});


// get user membership for authenticated user
router.get('/mail/:email', async(req, res) => {
    //alert();
    let result;
    // read value of id parameter from the request url
    const userEmail = req.params.email;

    // If validation passed execute query and return results
    // returns a single user with matching email and having membership
    try {
        // Send response with JSON result    
        result = await userService.getUserDetails(userEmail);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});


// POST - Insert a new newUser.
// This async function sends a HTTP POST request
router.post('/insert', async(req, res) => {

    // the request body contains the new newUser values - copy it
    const newUser = req.body;

    // show what was copied in the console (server side)
    console.log("userController: ", newUser);

    // Pass the new newUser data to the service and await the result
    try {
        // Send response with JSON result    
        result = await userService.createUser(newUser);

        // send a json response back to the client
        res.json(result);

        // handle server (status 500) errors
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

// POST - Update newUser.
// This async function sends a HTTP POST request
router.post('/update', async(req, res) => {

    // the request body contains the new newUser values - copy it
    const newUser = req.body;

    // show what was copied in the console (server side)
    console.log("userController: ", newUser);

    // Pass the User data to the service and await the result
    try {
        // Send response with JSON result    
        result = await userService.updateUser(newUser);

        // send a json response back to the client
        res.json(result);

        // handle server (status 500) errors
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

router.get('/role/:role', async(req, res) => {
    // get user with role

    let result;
    // read value of id parameter from the request url
    const userRole = req.params.role;

    // If validation passed execute query and return results
    // returns a single user with matching role 
    try {
        // Send response with JSON result    
        result = await userService.checkMembershipRole(userRole);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
});



// Export as a module
module.exports = router;