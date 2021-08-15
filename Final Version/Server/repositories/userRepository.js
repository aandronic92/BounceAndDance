// Dependencies
// require the database connection
const { sql, dbConnPoolPromise } = require('../database/db.js');

// for json path - Tell MS SQL to return results as JSON 
const SQL_SELECT_ALL = 'SELECT * FROM AppUser for json path;';

const SQL_ALL = 'SELECT * FROM AppUser WHERE Role = \'user\' for json path;';

// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_ID = 'SELECT * FROM AppUser WHERE UserId = @id for json path;';

const SQL_SELECT_BY_EMAIL = 'SELECT * FROM AppUser  WHERE Email = @email for json path, without_array_wrapper;';

const SQL_INSERT = "INSERT INTO AppUser (FirstName, LastName, DateOfBirth, PhoneNumber, Email,  Role, membership) VALUES (@firstName, @lastName, @dateOfBirth, @phoneNumber, @email, @role , @membership);";

const SQL_SELECT_CHECK_MEMBERSHIP = 'SELECT membership FROM AppUser  WHERE Email = @email AND membership IS NOT NULL for json path, without_array_wrapper;';

const SQL_SELECT_USER_BY_ROLE = 'SELECT * FROM AppUser  WHERE Role = @role for json path;';

const SQL_UPDATE = 'UPDATE AppUser SET FirstName = @firstName, LastName = @lastName, DateOfBirth = @dateOfBirth, PhoneNumber = @phoneNumber, Email = @email , Role = @role , membership = @membershipId WHERE UserID = @userID; SELECT * FROM MEMBERSHIP WHERE UserId = @userId;';

const SQL_DELETE = 'DELETE FROM AppUser Where UserId = @UserId';
// This is an async function named getMemberships defined using ES6 => syntax
let getUsers = async() => {

    // define variable to store memberhsips
    let users;

    // Get a DB connection and execute SQL (uses imported database module)
    // Note await in try/catch block
    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // execute query
            .query(SQL_SELECT_ALL);

        // first element of the recordset contains memberhsips
        users = result.recordset[0];

        // Catch and log errors to cserver side console 
    } catch (err) {
        console.log('DB Error - get all users: ', err.message);
    }

    // return memberhsips
    return users;
};

// get memberhsips by id
// This is an async function named getMemberhsipsById defined using ES6 => syntax
let getUserById = async(userId) => {

    let user;

    // returns a single memberhsips with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('id', sql.Int, userId)
            // execute query
            .query(SQL_SELECT_BY_ID);

        // Send response with JSON result    
        user = result.recordset[0];

    } catch (err) {
        console.log('DB Error - get User by id: ', err.message);
    }

    // return the memberhsip
    return user;
};

// get user by email
let getUserByEmail = async(email) => {

    let user;

    // returns a single memberhsip with matching email
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('email', sql.NVarChar, email)
            // execute query
            .query(SQL_SELECT_BY_EMAIL);

        // Send response with JSON result    
        user = result.recordset[0];

    } catch (err) {
        console.log('DB Error - get User by id: ', err.message);
    }

    // return the memberhsip
    return user;
};

// get user's membership
let checkMembership = async(email) => {

    let user;

    // returns membership id for the particular user
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @email parameter in the query
            .input('email', sql.NVarChar, email)
            // execute query
            .query(SQL_SELECT_CHECK_MEMBERSHIP);

        // Send response with JSON result    
        user = result.recordset[0];

    } catch (err) {
        console.log('DB Error - get User by email: ', err.message);
    }

    return user;

};
// get user by role
let getUserByRole = async(role) => {

    let user;

    // returns a single memberhsip with matching email
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('role', sql.NVarChar, role)
            // execute query
            .query(SQL_SELECT_USER_BY_ROLE);

        // Send response with JSON result    
        user = result.recordset[0];

    } catch (err) {
        console.log('DB Error - get User by role: ', err.message);
    }

    // return the memberhsip
    return user;
};

// insert new user
let createNewUser = async(userData) => {
    // Declare constants and variables
    let user;

    // Insert a new membership
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set named parameter(s) in query
            // checks for potential sql injection  
            .input('firstName', sql.NVarChar, userData.firstName)
            .input('lastName', sql.NVarChar, userData.lastName)
            .input('dateOfBirth', sql.NVarChar, userData.dateOfBirth)
            .input('phoneNumber', sql.NVarChar, userData.phoneNumber)
            .input('email', sql.NVarChar, userData.email)
            .input('role', sql.NVarChar, userData.role)
            .input('membership', sql.NVarChar, userData.membership)

        // Execute Query
        .query(SQL_INSERT);


        // catch and log DB errors
    } catch (err) {
        console.log('DB Error - error inserting a new user: ', err.message);
    }

    // Return the membership data
    return user;
};

// update new user
let updateUserDetails = async(userData) => {
    // Declare constants and variables
    let user;

    // update user
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise

        const result = await pool.request()
            // set named parameter(s) in query
            // checks for potential sql injection  
            .input('firstName', sql.NVarChar, userData.firstName)
            .input('lastName', sql.NVarChar, userData.lastName)
            .input('dateOfBirth', sql.NVarChar, userData.dateOfBirth)
            .input('phoneNumber', sql.NVarChar, userData.phoneNumber)
            .input('email', sql.NVarChar, userData.email)
            .input('role', sql.NVarChar, userData.role)
            .input('membershipId', sql.NVarChar, userData.membership)
            .input('userId', sql.NVarChar, userData.id)

        // Execute Query
        .query(SQL_UPDATE);

        // The newly inserted membership is returned by the query    
        user = result.recordset[0];

        // catch and log DB errors
    } catch (err) {
        console.log('DB Error - error updating user: ', err.message);
    }

    // Return the membership data
    return user;
};

let getAllUsers = async() => {
    let user;
    try {
        const pool = await dbConnPoolPromise

        const result = await pool.request().query(SQL_ALL);

        user = result.recordset[0];

        // catch and log DB errors
    } catch (err) {
        console.log('DB Error - error updating user: ', err.message);
    }

    // Return the users
    return user;
};

let deleteUser = async(UserId) => {
    let rowsAffected;
    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            .input('UserId', sql.NVarChar, UserId)
            .query(SQL_DELETE);
        rowsAffected = Number(result.rowsAffected);
    } catch (err) {
        console.log('DB Error - get query by id: ', err.message);
    }
    // Nothing deleted
    if (rowsAffected === 0)
        return false;
    // successful delete
    console.log('DB : ', rowsAffected);
    return true;
};

// Export 
module.exports = {
    getUsers,
    getUserById,
    getUserByEmail,
    checkMembership,
    getUserByRole,
    createNewUser,
    updateUserDetails,
    getAllUsers,
    deleteUser
};