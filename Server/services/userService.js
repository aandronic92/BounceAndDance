const authConfig = require("../config/auth_config.json");
const axios = require('axios').default;

let getAuthUser = async (accessToken) => {

    // Auth0 user info url
    const url = `${authConfig.issuer}userinfo`;
    const config = {
      headers: {
        "authorization": `Bearer ${accessToken}`
      }
    }
    
    // Use axios to make request
    const user = await axios.get(url, config);
  
    return user.data;
  }


// Module exports
// expose these functions
module.exports = {
    getAuthUser
};