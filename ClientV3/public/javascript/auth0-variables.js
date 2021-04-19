// Declare consts for Auth0 details required in this app

const CREATE_MEMBERSHIP = "create:memberships";
const READ_MEMBERSHIP = "read:memberships";
const UPDATE_MEMBERSHIP = "update:memberships";
const DELETE_MEMBERSHIP = "delete:memberships";

// The Auth0 id for this app

const AUTH0_CLIENT_ID = '8qsDEj5fLFqh5P0UokRuKug2XbhMOrdw';

const AUTH0_DOMAIN = 'dev-bsj6as08.us.auth0.com';

// Users of this app require access to the API, identified by...

// Auth0 Identifier 

const AUDIENCE = 'https://bounceanddanceapi.com';

// Where Auth0 return after authentication

const AUTH0_CALLBACK_URL = 'http://localhost:3000';

// Initialise Auth0 connection with parameters defined above

const auth0WebAuth = new auth0.WebAuth({

    domain: AUTH0_DOMAIN,

    clientID: AUTH0_CLIENT_ID,

    redirectUri: AUTH0_CALLBACK_URL,

    responseType: 'id_token token',

    audience: AUDIENCE

});

const auth0Authentication = new auth0.Authentication(auth0WebAuth, {

    domain: AUTH0_DOMAIN,

    clientID: AUTH0_CLIENT_ID

});