//Dependencies
const { sql, dbConnPoolPromise } = require('../database/db.js');

const SQL_SELECT_ALL = 'SELECT * FROM CLASS for json path;';
const SQL_INSERT = 'INSERT INTO CLASS (instructorId, className, userEmail, classDate , classTime , approval ) VALUES ( @instructorId, @className, @userEmail, @classDate , @classTime , @approval);';
const SQL_SELECT_BY_ID = 'SELECT * FROM CLASS WHERE instructorId = @instructorId for json path';
const SQL_SELECT_BY_ID_PENDING = 'SELECT * FROM CLASS WHERE instructorId = @instructorId and approval = \'Pending\' for json path';
const SQL_SELECT_BY_ID_APPROVED = 'SELECT * FROM CLASS WHERE instructorId = @instructorId and approval = \'Approved\' for json path';
const SQL_SELECT_BY_USER_EMAIL = 'SELECT * FROM CLASS WHERE userEmail = @userEmail for json path';
const SQL_DELETE = 'DELETE FROM CLASS WHERE classId = @id;';
const SQL_APPROVE = 'UPDATE CLASS SET approval = \'Approved\' WHERE classId = @id;';
// Get all classs
let getClasses = async() => {

    let classes;

    // Get a DB connection and execute SQL
    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()

        .query(SQL_SELECT_ALL);

        classes = result.recordset[0];

        // Catch and log errors to server side console 
    } catch (err) {
        console.log('DB Error - get all classes: ', err.message);
    }

    // return classs
    return classes;
};

// insert/ create a new class
let createNewClass = async(newClass) => {

    // Declare constants and variables
    let insertedClass;

    // Insert a new class
    try {
        console.log("classController: ", newClass);
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()

        // set named parameter(s) in query
        // checks for potential sql injection  
        .input('instructorId', sql.Int, newClass.instructorId)
            .input('className', sql.NVarChar, newClass.className)
            .input('userEmail', sql.NVarChar, newClass.userEmail)
            .input('classDate', sql.NVarChar, newClass.classDate)
            .input('classTime', sql.NVarChar, newClass.classTime)
            .input('approval', sql.NVarChar, newClass.approval)
            // Execute Query
            .query(SQL_INSERT);
        var results = { "success": "Success" };
        return results;
        // catch and log DB errors
    } catch (err) {
        console.log('DB Error - error inserting a new class: ', err.message);
    }
};

// get class by instructorid
let getClassesByInstructorId = async(instructorId) => {

    let classes;

    // returns class with matching instructor id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('instructorId', sql.Int, instructorId)
            // execute query
            .query(SQL_SELECT_BY_ID);

        // Send response with JSON result    
        classes = result.recordset[0];

    } catch (err) {
        console.log('DB Error - get class by instructor id: ', err.message);
    }

    // return the classes
    return classes;
};



// get class by instructorid
let getPendingClassesByInstructorId = async(instructorId) => {

    let classes;

    // returns class with matching instructor id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('instructorId', sql.Int, instructorId)
            // execute query
            .query(SQL_SELECT_BY_ID_PENDING);

        // Send response with JSON result    
        classes = result.recordset[0];

    } catch (err) {
        console.log('DB Error - get class by instructor id: ', err.message);
    }

    // return the classes
    return classes;
};


// get class by instructorid
let getApprovedClassesByInstructorId = async(instructorId) => {

    let classes;

    // returns class with matching instructor id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('instructorId', sql.Int, instructorId)
            // execute query
            .query(SQL_SELECT_BY_ID_APPROVED);

        // Send response with JSON result    
        classes = result.recordset[0];

    } catch (err) {
        console.log('DB Error - get class by instructor id: ', err.message);
    }

    // return the classes
    return classes;
};


// get class by userEmail
let getClassesByUserEmail = async(userEmail) => {

    let classes;

    // returns class with matching userEmail
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @userEmail parameter in the query
            .input('userEmail', sql.NVarChar, userEmail)
            // execute query
            .query(SQL_SELECT_BY_USER_EMAIL);

        // Send response with JSON result    
        classes = result.recordset[0];

    } catch (err) {
        console.log('DB Error - get class by user  Email: ', err.message);
    }

    // return the classes
    return classes;
};


// delete a package
let deleteClassById = async(classId) => {

    // record how many rows were deleted  > 0 = success
    let rowsAffected;

    // returns a single class with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('id', sql.Int, classId)
            // execute query
            .query(SQL_DELETE);

        // Was the class deleted?    
        rowsAffected = Number(result.rowsAffected);

    } catch (err) {
        console.log('DB Error - get class by id: ', err.message);
    }
    // Nothing deleted
    if (rowsAffected === 0)
        return false;
    // successful delete
    return true;
};


let approveClass = async(classId) => {
    let rewAffected;

    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            .input('id', sql.Int, classId)
            .query(SQL_APPROVE);
        rowsAffected = Number(result.rowsAffected);

    } catch (err) {
        console.log('DB Error - update class by id: ', err.message);
    }

    if (rowsAffected === 0)
        return false;

    return true;
};



module.exports = {
    createNewClass,
    getClasses,
    getClassesByInstructorId,
    getClassesByUserEmail,
    deleteClassById,
    getPendingClassesByInstructorId,
    getApprovedClassesByInstructorId,
    approveClass
};