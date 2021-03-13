// Dependencies
// require the database connection
const { sql, dbConnPoolPromise } = require('../database/db.js');

// for json path - Tell MS SQL to return results as JSON 
const SQL_SELECT_ALL = 'SELECT * FROM AppUser for json path;';

// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_ID = 'SELECT * FROM AppUser WHERE UserId = @id for json path, without_array_wrapper;';

const SQL_SELECT_BY_EMAIL = 'SELECT * FROM AppUser  WHERE Email = @email for json path, without_array_wrapper;';

const SQL_INSERT = "INSERT INTO AppUser (FirstName, LastName, DateOfBirth, PhoneNumber, Email, Password, Role) VALUES (@firstName, @lastName, @dateOfBirth, phoneNumber, @email, @password, 'User'); SELECT * from dbo.AppUser WHERE UserId = SCOPE_IDENTITY();";

// This is an async function named getMemberships defined using ES6 => syntax
let getUsers = async () => {

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
let getUserById = async (userId) => {

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
let getUserByEmail = async (email) => {

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


// Export 
module.exports = {
    getUsers,
    getUserById,
    getUserByEmail
};