//Dependencies
const { sql, dbConnPoolPromise } = require('../database/db.js');


const SQL_SELECT_ALL = 'SELECT * FROM MEMBERSHIP ORDER BY membershipPrice ASC for json path;';

// use for single json result
const SQL_SELECT_BY_ID = 'SELECT * FROM MEMBERSHIP WHERE membershipId = @id for json path, without_array_wrapper;';

// Second statement (Select...) returns inserted record identified by membership_id = SCOPE_IDENTITY()
const SQL_INSERT = 'INSERT INTO MEMBERSHIP (instructorId, membershipName, membershipSessions, membershipPrice) VALUES ( @instructorId, @membershipName, @membershipSessions, @membershipPrice); SELECT * from dbo.MEMBERSHIP WHERE membershipId = SCOPE_IDENTITY();';

const SQL_UPDATE = 'UPDATE MEMBERSHIP SET instructorId = @instructorId, membershipName = @membershipName, membershipSessions = @membershipSessions, membershipPrice = @membershipPrice WHERE membershipId = @membershipId; SELECT * FROM MEMBERSHIP WHERE membershipId = @membershipId;';

const SQL_DELETE = 'DELETE FROM MEMBERSHIP WHERE membershipId = @id;';

// Get all memberships
let getMemberships = async () => {

    let memberships;

    // Get a DB connection and execute SQL
    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()
           
            .query(SQL_SELECT_ALL);
        
        memberships = result.recordset[0];

    // Catch and log errors to server side console 
    } catch (err) {
        console.log('DB Error - get all memberships: ', err.message);
    }

    // return memberships
    return memberships;
};


// get membership by id
let getMembershipById = async (membershipId) => {

    let membership;

    // returns a single membership with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('id', sql.Int, membershipId)
            // execute query
            .query(SQL_SELECT_BY_ID);

        // Send response with JSON result    
        membership = result.recordset[0];

        } catch (err) {
            console.log('DB Error - get membership by id: ', err.message);
        }
        
        // return the membership
        return membership;
};

// insert/ create a new membership
let createMembership = async (membership) => {

    // Declare constants and variables
    let insertedMembership;

    // Insert a new membership
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()

            // set named parameter(s) in query
            // checks for potential sql injection  
            .input('instructorId', sql.Int,  membership.instructorId)
            .input('membershipName', sql.NVarChar, membership.membershipName)
            .input('membershipSessions', sql.Int,  membership.membershipSessions)
            .input('membershipPrice', sql.Decimal, membership.membershipPrice)

            // Execute Query
            .query(SQL_INSERT);      

        // The newly inserted membership is returned by the query    
        insertedMembership = result.recordset[0];

        // catch and log DB errors
        } catch (err) {
            console.log('DB Error - error inserting a new membership: ', err.message);
        }

        // Return the membership data
        return insertedMembership;
};

// update an existing membership
let updateMembership = async (membership) => {

    // Declare variables
    let updatedMembership;

    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
 
            // set named parameter(s) in query
            // checks for potential sql injection
            .input('membershipId', sql.Int, membership.membershipId)  
            .input('instructorId', sql.Int, membership.instructorId)    
            .input('membershipName', sql.NVarChar, membership.membershipName)
            .input('membershipSessions', sql.Int, membership.membershipSessions) 
            .input('membershipPrice', sql.Decimal, membership.membershipPrice)
 
            // Execute Query
            .query(SQL_UPDATE);      
 
        // The newly inserted membership is returned by the query    
        updatedMembership = result.recordset[0];
 
        // catch and log DB errors
        } catch (err) {
            console.log('DB Error - error updating membership: ', err.message);
        }
 
        // Return the membership data
        return updatedMembership;
 };
 
 // delete a package
let deleteMembership = async (membershipId) => {

    // record how many rows were deleted  > 0 = success
    let rowsAffected;

    // returns a single membership with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set @id parameter in the query
            .input('id', sql.Int, membershipId)
            // execute query
            .query(SQL_DELETE);

        // Was the membership deleted?    
        rowsAffected = Number(result.rowsAffected);     

        } catch (err) {
            console.log('DB Error - get membership by id: ', err.message);
        }
        // Nothing deleted
        if (rowsAffected === 0)
            return false;
        // successful delete
        return true;    
};

module.exports = {
    getMemberships,
    getMembershipById,
    createMembership,
    updateMembership,
    deleteMembership
};
