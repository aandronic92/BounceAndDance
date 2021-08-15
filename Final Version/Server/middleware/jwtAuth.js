// Dependencies
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const jwtAuthz = require('express-jwt-authz');

// Configuration settings
const authConfig = require("../config/auth_config.json");
 
// Authentication
//
// create the JWT middleware
const checkJwt = jwt({
    // Gets the JSON Web Key Set which will be used to verify the access token and issuer.
    // Sets other required parameters including the algorithm to be used 
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${authConfig.issuer}.well-known/jwks.json`
    }),
  
    audience: authConfig.audience,
    issuer: authConfig.issuer,
    algorithms: authConfig.algorithms
  });

// Authorisation
const checkAuth = (permissions) => jwtAuthz(permissions, {customScopeKey: "permissions", checkAllScopes: true });  

// Export
module.exports = {
  authConfig,
  checkJwt,
  checkAuth
};
