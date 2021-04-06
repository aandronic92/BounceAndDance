// require the database connection
const classRepository = require('../repositories/classRepository.js');

// Input validation package
//const validator = require('validator');


// Get all classs via the repository
// return classs
let getClass = async() => {
    let classes = await classRepository.getClasses();
    return classes;
};



// Insert a new class
// This function accepts class data as a paramter from the controller.
let createClass = async(newClass) => {

    // declare variables
    let newlyInsertedClass;

    // Call the class validator - kept seperate to avoid clutter here
    //let newClass = classValidator.validateNewClass(newClass);

    // If validation returned a class object - save to database
    if (newClass != null) {
        console.log("classController: ", newClass);
        newlyInsertedClass = await classRepository.createNewClass(newClass);
    } else {

        // class data failed validation 
        newlyInsertedClass = { "error": "invalid class" };

        // debug info
        console.log("classService.createClass(): form data validate failed");
    }

    // return the newly inserted class
    return newlyInsertedClass;
};

// Get class by instructor id via the repository

let getClassByInstructorId = async(instructorId) => {
    let classes;

    // get membership
    classes = await classRepository.getClassesByInstructorId(instructorId);

    return classes;
};

// Get class by user id via the repository

let getClassByUserEmail = async(userEmail) => {
    let classes;

    // get membership
    classes = await classRepository.getClassesByUserEmail(userEmail);

    return classes;
};

module.exports = {
    createClass,
    getClass,
    getClassByInstructorId,
    getClassByUserEmail
};