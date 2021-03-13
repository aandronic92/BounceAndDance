const router = require('express').Router();
const userService = require('../services/userService.js');

// Auth0
const { authConfig, checkJwt, checkAuth } = require('../middleware/jwtAuth.js');

/* Hand get requests for '/'
/* this is the default rout
*/
router.get('/', function (req, res) {

    // set content type of response body in the headers
    res.setHeader('Content-Type', 'application/json');

    // Send a JSON response - this app will be a web api so no need to send HTML
    //res.end(JSON.stringify({message: 'This is the home page'}));
    res.json({content: 'This is the default route - try /user/profile'});

});

// get user profile for authenticated user
// http://localhost:8585/user/profile
router.get('/profile', async (req, res) => {

    let userProfile;
    // Get memberships
    try {
        // Get info from user profile
        // if logged in (therefore access token exists)
        // get token from request
        if (req.headers['authorization']) {
            let token = req.headers['authorization'].replace('Bearer ', '');
            userProfile = await userService.getAuthUser(token);
            console.log("user email: ", profile.email);
        }

        res.json(userProfile);

      // Catch and send errors  
      } catch (err) {
        console.log(`ERROR getting user profile: ${err.message}`);
        res.status(500);
        res.send(err.message);
      }


});


// Export as a module
module.exports = router;