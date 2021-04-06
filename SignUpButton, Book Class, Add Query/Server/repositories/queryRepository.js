//Dependencies
const { sql, dbConnPoolPromise } = require('../database/db.js');


const SQL_SELECT_ALL = 'SELECT * FROM QUERIES ORDER BY queryId ASC for json path;';

// use for single json result
const SQL_SELECT_BY_EMAIL = 'SELECT * FROM QUERIES WHERE userEmail = @email for json path, without_array_wrapper;';

// Second statement (Select...) returns inserted record identified by query_email = SCOPE_IDENTITY()
const SQL_INSERT = 'INSERT INTO QUERIES (userName, userEmail, queryDesc) VALUES (@userName, @email, @queryDesc); SELECT * from dbo.QUERIES WHERE userEmail = @email;';

const SQL_UPDATE = 'UPDATE QUERIES SET userName = @userName , userEmail = @email, queryDesc = @queryDesc, instructorId = @instructorId, instructorReply = @instructorReply WHERE userEmail = @email; SELECT * from dbo.QUERIES WHERE userEmail = @email;';

const SQL_DELETE = 'DELETE FROM QUERIES WHERE queryId = @id;';

// Get all querys
let getQueries = async() => {

    let querys;

    // Get a DB connection and execute SQL
    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()

        .query(SQL_SELECT_ALL);

        querys = result.recordset[0];

        // Catch and log errors to server side console 
    } catch (err) {
        console.log('DB Error - get all querys: ', err.message);
    }

    // return querys
    return querys;
};


// get query by email
let getQueryByEmail = async(queryEmail) => {

    let query;

    // returns a single query with matching email
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @email parameter in the query
            .input('email', sql.Int, queryEmail)
            // execute query
            .query(SQL_SELECT_BY_EMAIL);

        // Send response with JSON result    
        query = result.recordset[0];

    } catch (err) {
        console.log('DB Error - get query by email: ', err.message);
    }

    // return the query
    return query;
};

// insert/ create a new query
let createQuery = async(query) => {

    // Declare constants and variables
    let insertedQuery;

    // Insert a new query
    try {

        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()

        // set named parameter(s) in query
        // checks for potential sql injection  
        .input('userName', sql.NVarChar, query.userName)
            .input('email', sql.NVarChar, query.userEmail)
            .input('queryDesc', sql.NVarChar, query.queryDesc)

        // Execute Query
        .query(SQL_INSERT);

        // The newly inserted query is returned by the query    
        insertedQuery = result.recordset[0];

        // catch and log DB errors
    } catch (err) {
        console.log('DB Error - error inserting a new query: ', err.message);
    }

    // Return the query data
    return insertedQuery;
};

// update an existing query
let updateQuery = async(query) => {

    // Declare variables
    let updatedQuery;

    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()

        // set named parameter(s) in query
        // checks for potential sql injection
        .input('userName', sql.NVarChar, query.userName)
            .input('email', sql.NVarChar, query.userEmail)
            .input('instructorId', sql.Int, query.instructorId)
            .input('queryDesc', sql.NVarChar, query.queryDesc)
            .input('instructorReply', sql.Int, query.instructorReply)

        // Execute Query
        .query(SQL_UPDATE);

        // The newly inserted query is returned by the query    
        updatedQuery = result.recordset[0];

        // catch and log DB errors
    } catch (err) {
        console.log('DB Error - error updating query: ', err.message);
    }

    // Return the query data
    return updatedQuery;
};

// delete a package
let deleteQuery = async(queryId) => {

    // record how many rows were deleted  > 0 = success
    let rowsAffected;

    // returns a single query with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('id', sql.Int, queryId)
            // execute query
            .query(SQL_DELETE);

        // Was the query deleted?    
        rowsAffected = Number(result.rowsAffected);

    } catch (err) {
        console.log('DB Error - get query by id: ', err.message);
    }
    // Nothing deleted
    if (rowsAffected === 0)
        return false;
    // successful delete
    return true;
};

module.exports = {
    getQueries,
    getQueryByEmail,
    createQuery,
    updateQuery,
    deleteQuery
};