// require the database connection
const queryRepository = require('../repositories/queryRepository.js');

// Input validation package
const validator = require('validator');


// Get all queries via the repository
// return queries
let getQueries = async() => {
    let queries = await queryRepository.getQueries();
    return queries;
};

// Get query by email via the repository

let getQueryByEmail = async(queryEmail) => {
    let query;

    // get query
    query = await queryRepository.getQueryByEmail(queryEmail);

    return query;
};

// Insert a new query
// This function accepts query data as a paramter from the controller.
let createQuery = async(query) => {

    // declare variables
    let newlyInsertedQuery;


    newlyInsertedQuery = await queryRepository.createQuery(query);

    // return the newly inserted query
    return newlyInsertedQuery;
};

// query update service
let updateQuery = async(query) => {

    // Declare variables and consts
    let updatedQuery;

    updatedQuery = await queryRepository.updateQuery(query);

    // return the newly inserted query
    return updatedQuery;
};

let deleteQuery = async(queryId) => {

    let deleteResult = false;

    // delete query by email
    // result: true or false
    deleteResult = await queryRepository.deleteQueryById(queryId);

    // sucess
    return deleteResult;
};

module.exports = {
    getQueryByEmail,
    getQueries,
    createQuery,
    updateQuery,
    deleteQuery
};