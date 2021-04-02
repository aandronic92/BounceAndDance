// Client url
const clientUrl = "http://localhost:3000";

// Get access token (from session storage, etc.)

function getAccessToken() {
    return sessionStorage.getItem('accessToken');
}

// check login status

function checkStatus() {
    // Get access tokem from browser sessionStorage
    const accessToken = sessionStorage.getItem('accessToken');
    // Check if expired
    const expirationDate = new Date(Number.parseInt(sessionStorage.getItem('expirationDate')));
    const isExpired = expirationDate < new Date();
    let status;
    // Log details to console
    if (!accessToken) {
        status = 'There is no access token present in local storage, meaning that you are not logged in.';
    } else if (isExpired) {
        status = 'There is an expired access token in local storage.';
    } else {
        status = `There is an access token in local storage, and it expires on ${expirationDate}.`;
    }

    console.log("status: ", status);
    // If logged in
    // Use jQuery to hide login then show logout and profile
    if (accessToken && !isExpired) {
        $('#login').hide();
        $('#logout').show();
        $('#get-profile').show();
        $('#Membership').show();
        $('#Home').hide();
        // (re)load memberships display to reflect change
        loadMemberships();
        // else - not logged in
        // Use jQuery to hide logout and profile then show login

    } else {
        $('#get-profile').hide();
        $('#logout').hide();
        $('#login').show();
        $('#Home').show();
        $('#Membership').hide();
    }


}

// Save the token to session storage
function saveAuthResult(result) {
    sessionStorage.setItem('accessToken', result.accessToken);
    sessionStorage.setItem('idToken', result.idToken);
    sessionStorage.setItem('expirationDate', Date.now() + Number.parseInt(result.expiresIn) * 1000);
    // Refresh the page
    checkStatus();
    auth0Authentication.userInfo(getAccessToken(), (err, usrInfo) => {
        if (err) {
            // handle error
            console.error('Failed to get userInfo');
            return;
        }

        if (usrInfo.nickname == "admin") {
            console.log(usrInfo.nickname);
            window.location = "/adminDashboard.html";
        }

    });
}

// Check token validity
function checkSession() {
    auth0WebAuth.checkSession({
        responseType: 'token id_token',
        timeout: 5000,
        usePostMessage: true
    }, function(err, result) {
        if (err) {
            console.log(`Could not get a new token using silent authentication (${err.error}).`);
            $('#get-profile').hide();
            $('#logout').hide();
            $('#login').show();
        } else {
            saveAuthResult(result);
        }
    });
}

// Login event handler

// Call Auth0 to handle login (then return here)
document.querySelector("#login").addEventListener("click", function(event) {
    // Prevent form submission (if used in a form)
    event.preventDefault();
    // Call the Auth0 authorize function
    // auth0WebAuth is defined in auth0-variables.js
    auth0WebAuth.authorize({ returnTo: clientUrl });
    console.log("Logged in");
}, false);

// Logout

// Call Auth0 to handle logout (then return here)

document.querySelector("#logout").addEventListener("click", function(event) {
    event.preventDefault();
    // remove tokens from session storage
    sessionStorage.clear();
    auth0WebAuth.logout({ returnTo: clientUrl });
    console.log("Logged out");

}, false);

// get user profile from Auth0

document.querySelector("#get-profile").addEventListener("click", async function(event) {

    event.preventDefault();
    auth0Authentication.userInfo(getAccessToken(), (err, usrInfo) => {
        if (err) {
            // handle error
            console.error('Failed to get userInfo');
            return;
        }
        // Output result to console (for testing purposes)
        console.log(usrInfo);
        document.querySelector("#results pre").innerHTML = JSON.stringify(usrInfo, null, 2);

    });

}, false);

function checkAuth(permission) {
    const jwt = getAccessToken();
    if (jwt != null) {
        const decoded = jwt_decode(jwt);
        return decoded.permissions.includes(permission);
    } else {
        return false;
    }
}


// When page is loaded
window.onload = (event) => {
    // execute this code
    auth0WebAuth.parseHash(function(err, result) {
        if (result) {
            saveAuthResult(result);
        }
    });
    // check login status after page loads.
    checkStatus();
    setTimeout(function() {
        document.querySelector(".loader").style.display = "none";
    }, 2000);

};