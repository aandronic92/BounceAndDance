// require the database connection
const userRepository = require('../repositories/userRepository.js');
const authConfig = require("../config/auth_config.json");
const axios = require('axios').default;

// Input validation package
const validator = require('validator');

let getAuthUser = async(accessToken) => {

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
};

// Get user by email with user via the repository
let checkMembershipEmail = async(userEmail) => {

    // get membership
    user = await userRepository.checkMembership(userEmail);

    return user;
};

// Get user by email with user via the repository
let getUserDetails = async(userEmail) => {

    // get membership
    user = await userRepository.getUserByEmail(userEmail);

    return user;
};

// Get user by email with user via the repository
let getUserDetailsId = async(userId) => {

    // get membership
    user = await userRepository.getUserById(userId);

    return user;
};


// Get user by role via the repository
let checkMembershipRole = async(userRole) => {

    // get membership
    user = await userRepository.getUserByRole(userRole);

    return user;
};

// Insert User
let createUser = async(userData) => {
    let user;

    // Create New User
    user = await userRepository.createNewUser(userData);

    return user;
};

// Update User
let updateUser = async(userData) => {
    let user;

    // Update User
    user = await userRepository.updateUserDetails(userData);

    return user;
};

let getAllUsers = async() => {
    let users;

    users = await userRepository.getAllUsers();

    return users;
};

let deleteUser = async(UserId) => {

    let deleteResult = false;

    // result: true or false
    deleteResult = await userRepository.deleteUser(UserId);

    // sucess
    return deleteResult;
};


// Module exports
// expose these functions
module.exports = {
    getAuthUser,
    checkMembershipEmail,
    checkMembershipRole,
    getUserDetails,
    createUser,
    updateUser,
    getUserDetailsId,
    getAllUsers,
    deleteUser
};