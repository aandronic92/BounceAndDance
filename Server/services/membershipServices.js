// require the database connection
const membershipRepository = require ( '../repositories/membershipRepository.js');
const membershipValidator = require('../validators/membershipValidator.js');

// Input validation package
const validator = require('validator');


// Get all memberships via the repository
// return memberships
let getMemberships = async () => {
    let memberships = await membershipRepository.getMemberships();
    return memberships;
};

// Get membership by id via the repository

let getMembershipById = async (membershipId) => {
    let membership;
    // Validate input - important as a bad input could crash the server or lead to an attack
    if (!validator.isNumeric(membershipId, { no_symbols: true })) {
        console.log("getMembership service error: invalid id parameter");
        return "invalid parameter";
    }
    // get membership
    membership = await membershipRepository.getMembershipById(membershipId);

    return membership;
};

// Insert a new membership
// This function accepts membership data as a paramter from the controller.
let createMembership = async (membership) => {

    // declare variables
    let newlyInsertedMembership;

    // Call the membership validator - kept seperate to avoid clutter here
    let validatedMembership = membershipValidator.validateNewMembership(membership);

    // If validation returned a membership object - save to database
    if (validatedMembership != null) {
        newlyInsertedMembership = await membershipRepository.createMembership(validatedMembership);
    } else {

        // membership data failed validation 
        newlyInsertedMembership = {"error": "invalid membership"};

        // debug info
        console.log("membershipService.createMembership(): form data validate failed");
    }

    // return the newly inserted membership
    return newlyInsertedMembership;
};

// membership update service
let updateMembership = async (membership) => {

    // Declare variables and consts
    let updatedMembership;

    // call the membership validator
    let validatedMembership = membershipValidator.validateUpdateMembership(membership);

    // If validation returned a membership object - save to database
    if (validatedMembership != null) {
        updatedMembership = await membershipRepository.updateMembership(membership);
    } else {

        // membership data failed validation 
        updatedMembership = {"error": "membership update failed"};

        // debug info
        console.log("membershipService.updateMembership(): form data validate failed");
    }

    // return the newly inserted membership
    return updatedMembership;
};

let deleteMembership = async (membershipId) => {

    let deleteResult = false;

    // Validate input - important as a bad input could crash the server or lead to an attack
    // appending + '' to numbers as the validator only works with strings
    if (!membershipValidator.validateId(membershipId)) {
        console.log("deleteMembership service error: invalid id parameter");
        return false;
    }

    // delete membership by id
    // result: true or false
    deleteResult = await membershipRepository.deleteMembership(membershipId);

    // sucess
    return deleteResult;
};

module.exports = {
    getMembershipById,
    getMemberships,
    createMembership,
    updateMembership,
    deleteMembership
};