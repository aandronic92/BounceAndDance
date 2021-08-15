const validator = require('validator');

// models
const Membership = require('../models/membership.js');

// Validate id field
let validateId = (id) => {

    // check if number is numeric
    if (validator.isNumeric(id + '', { no_symbols: true, allow_negatives: false })) {
        return true;
    } else {
        console.log("Membership validator: invalid id parameter");
    }
    // validation failed
    return false;
}

// Validate the body data, sent by the client, for a new membership
let validateNewMembership = (formMembership) => {

    // Declare constants and variables
    let validatedMembership;

    // debug to console - if no data
    if (formMembership === null) {
        console.log("validateNewMembership(): Parameter is null");
    }

    // Validate form data for new Membership fields
    // Creating a Membership does not need a Membership id
    if (!validator.isEmpty(formMembership.membershipName) &&
        validator.isNumeric(formMembership.membershipSessions + '', { no_symbols: true, allow_negatives: false }) &&
        validator.isCurrency(formMembership.membershipPrice + '', { no_symbols: true, allow_negatives: false })) {

        // Validation passed
        // create a new Membership instance based on Membership model object
        validatedMembership = new Membership(
            '',
            null,
            validator.escape(formMembership.membershipName),
            formMembership.membershipSessions,
            formMembership.membershipPrice
        );
    } else {
        // debug
        console.log("validateNewMembership(): Validation failed");
    }
    console.log(validatedMembership);
    // return new validated Membership object
    return validatedMembership;
}

// Validate the body data, sent by the client, for a new Membership
let validateUpdateMembership = (formMembership) => {

    // Declare constants and variables
    let validatedMembership;

    // debug to console - if no data
    if (formMembership === null) {
        console.log("validateNewMembershipt(): Parameter is null");
    }

    if (
        validator.isNumeric(formMembership.membershipId + '', { no_symbols: true, allow_negatives: false }) &&
        !validator.isEmpty(formMembership.membershipName) &&
        validator.isNumeric(formMembership.membershipSessions + '', { no_symbols: true, allow_negatives: false }) &&
        validator.isCurrency(formMembership.membershipPrice + '', { no_symbols: true, allow_negatives: false })) {
        // Validation passed
        validatedMembership = new Membership(
            formMembership.membershipId,

            // escape is to sanitize - it removes/ encodes any html tags
            validator.escape(formMembership.membershipName),
            formMembership.membershipSessions,
            formMembership.membershipPrice
        );
    } else {
        // debug
        console.log("validateUpdateMembership(): Validation failed");
    }

    // return new validated membership object
    return validatedMembership;
}

// Module exports
module.exports = {
    validateId,
    validateNewMembership,
    validateUpdateMembership
}