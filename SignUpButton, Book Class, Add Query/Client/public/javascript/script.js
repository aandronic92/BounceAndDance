// API Base URL - the server address
const BASE_URL = `http://localhost:8585`;

function getHeaders() {
    // Return headers
    return new Headers({
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getAccessToken()

    });

}

// Asynchronous Function getDataAsync from a url and return
async function getDataAsync(url) {

    const GET_INIT = { method: 'GET', credentials: 'include', headers: getHeaders(), mode: 'cors', cache: 'default' };

    // Try catch 
    try {
        // Call fetch and await the respose
        // Initally returns a promise
        const response = await fetch(url, GET_INIT);

        // Resonse is dependant on fetch
        const json = await response.json();

        return json;

        // catch and log any errors
    } catch (err) {
        console.log(err);
        return err;
    }
}

function displayMemberships(memberships) {

    // check user permissions
    const showUpdate = checkAuth(UPDATE_MEMBERSHIP);
    const showDelete = checkAuth(DELETE_MEMBERSHIP);

    // Show add membership button
    if (checkAuth(CREATE_MEMBERSHIP))
        $('.shouldHide').show();
    else
        $('.shouldHide').hide();

    $('.buyMembership').hide();
    if (memberships != null) {
        const rows = memberships.map(membership => {
            // returns a template string for each membership
            let row = `<tr>
            
                <td>${membership.membershipName}</td>
                <td>${membership.membershipSessions}</td>
                <td class="price">&euro;${Number(membership.membershipPrice).toFixed(2)}</td>`;

            // if user has permission to update - add the edit button
            if (showUpdate)
                row += `<td>
                  <button class="btn btn-xs" data-toggle="modal" data-target="#MembershipFormDialog" 
                  onclick="prepareMembershipUpdate(${membership.membershipId})">
                  <span class="oi oi-pencil" data-toggle="tooltip" title="Edit Membership"></span></button>
                </td>`
                // if user has permission to delete - add the delete button          
            if (showDelete)
                row += `<td>
                  <button class="btn btn-xs" onclick="deleteMembership(${membership.membershipId})">
                  <span class="oi oi-trash" data-toggle="tooltip" title="Delete Membership"></span></button>
                </td>`
            if (!checkAuth(UPDATE_MEMBERSHIP) && !checkAuth(DELETE_MEMBERSHIP) && !checkAuth(CREATE_MEMBERSHIP))
                $('.buyMembership').show();
            row += `<td>
                  <button class="btn btn-xs" onclick="buyMembership(${membership.membershipId})">
                  <span class="oi oi-cart" data-toggle="tooltip" title="BUY Membership">BUY</span></button>
                </td>`
                // finally, end the row and return
            row += '</tr>';
            return row;
        });
        // Set the innerHTML of the membershipRows root element = rows
        document.getElementById('membershipRows').innerHTML = rows.join('');

    } else {
        document.getElementById('membershipRows').innerHTML = `<tr><td>No Memberships to display</td></tr>`;
    }

} // end function

async function loadMemberships() {
    try {

        // Get a list of memberships
        const memberships = await getDataAsync(`${BASE_URL}/membership`);
        // Call displayMemberships(), passing the retrieved memberships list
        displayMemberships(memberships);
    } // catch and log any errors
    catch (err) {
        console.log(err);
    }
}

function getMembershipForm() {

    // Get form fields
    const mId = document.getElementById('membershipId').value;
    const instId = document.getElementById('instructorId').value;
    const mName = document.getElementById('membershipName').value;
    const mSessions = document.getElementById('membershipSessions').value;
    const mPrice = document.getElementById('membershipPrice').value;

    // build membership object for Insert or Update
    // required for sending to the API
    const membershipObj = {
            membershipId: mId,
            instructorId: instId,
            membershipName: mName,
            membershipSessions: mSessions,
            membershipPrice: mPrice
        }
        // return the body data
    return membershipObj;
}

// Setup membership form (for inserting or updating)
function membershipFormSetup(title) {
    // Set form title
    document.getElementById("membershipFormTitle").innerHTML = title;

    // reset the form and change the title
    document.getElementById("membershipForm").reset();
    // form reset doesn't work for hidden inputs!!
    document.getElementById("membershipId").value = 0;
}

// Add a new Membership - called by form submit

async function addOrUpdateMembership() {
    // url for api call
    const url = `${BASE_URL}/membership`
    let httpMethod = "POST";

    // get new membership data as json (the request body)
    const membershipObj = getMembershipForm();

    // If membershipId > 0 then this is an existing membership for update
    if (membershipObj.membershipId > 0) {
        httpMethod = "PUT";
    }
    // build the request object - note: POST
    // reqBodyJson added to the req body
    const request = {
        method: httpMethod,
        headers: getHeaders(),
        // credentials: 'include',
        mode: 'cors',
        // convert JS Object to JSON and add to request body
        body: JSON.stringify(membershipObj)
    };

    // Try catch 
    try {
        // Call fetch and await the respose
        // fetch url using request object
        const response = await fetch(url, request);
        const json = await response.json();

        // Output result to console (for testing purposes) 
        console.log(json);

        // catch and log any errors
    } catch (err) {
        console.log(err);
        return err;
    }
    // Refresh memberships list
    loadMemberships();
}
// When a membership is selected for update/ editing, get it by id and fill out the form
async function prepareMembershipUpdate(id) {
    try {
        // 1. Get membership by id
        const membership = await getDataAsync(`${BASE_URL}/membership/${id}`);

        // 2. Set up the form (title, etc.)
        membershipFormSetup(`Update membership ID: ${membership.membershipId}`);

        // 3. Fill out the form
        document.getElementById('membershipId').value = membership.membershipId; // uses a hidden field - see the form
        document.getElementById('instructoId').value = membership.instructorId;
        document.getElementById('membershipName').value = membership.membershipName;
        document.getElementById('membershipSessions').value = membership.membershipSessions;
        document.getElementById('membershipPrice').value = membership.membershipPrice;

    } // catch and log any errors
    catch (err) {
        console.log(err);
    }
}

// Delete membership by id using an HTTP DELETE request
async function deleteMembership(id) {

    // Build the request object
    const request = {
        // set http method
        method: 'DELETE',
        headers: getHeaders(),
        // credentials: 'include',
        mode: 'cors',
    };
    // Cofirm delete
    if (confirm("Are you sure?")) {
        // build the api url for deleting a membership
        const url = `${BASE_URL}/membership/${id}`;
        // Try catch 
        try {
            // call the api and get a result
            const result = await fetch(url, request);
            const response = await result.json();
            // if success (true result), refresh membership list
            if (response == true)
                loadMemberships();

            // catch and log any errors
        } catch (err) {
            console.log(err);
            return err;
        }
    }
}

// Check if the current user has membership by email 
async function hasmembership(email) {
    try {
        const membership = await getDataAsync(`${BASE_URL}/user/membership/${email}`);
        if (membership != null) {
            // returns true if user has membership
            return true;
        } else {
            // returns true if user don't have membership
            return false;
        }
    } // catch and log any errors
    catch (err) {
        console.log(err);
    }
}

// Get user details by email 
async function getUserWithMail(email) {

    try {
        const userDet = await getDataAsync(`${BASE_URL}/user/mail/${email}`);
        if (userDet != null) {
            // returns user details 
            return userDet;
        } else {
            //returns false if no user found with email
            return false;
        }
    } // catch and log any errors
    catch (err) {
        console.log(err);
    }
}

// Get instructors from Appuser table to show up in Select Input in book a class form 
async function loadInstructorsList() {

    try {

        // Get a list of instructors
        const instructors = await getDataAsync(`${BASE_URL}/user/role/instructor`);

        // retrieved instructors list
        if (instructors != null) {
            const rows = instructors.map(instructor => {
                // returns a template string for each instructors
                let row = `<option value="${instructor.UserId}">${instructor.FirstName} ${instructor.LastName} (${instructor.Email}) </option></td>`;
                return row;
            });
            // Set the innerHTML of the instructorId root element = rows
            document.getElementById('instructorId').innerHTML = rows.join('');
        }
    } // catch and log any errors
    catch (err) {

        console.log(err);
    }
}


// Get list of all the classes of instructor to check if the instructor is available for the given date and time 
async function getAllClassesForInstructor(instructorId) {

    try {
        console.log(`${BASE_URL}/class/${instructorId}`);
        // Get a list of classInstructor with given id
        const instructors = await getDataAsync(`${BASE_URL}/class/${instructorId}`);

        if (instructors != null) {

            return instructors;

        }
    } // catch and log any errors
    catch (err) {

        console.log(err);
    }
}

// Search in Object
async function searchInObj(toFind, findIn, ObjectList) {

    var searchRes = [];
    for (var i = 0; i < ObjectList.length; i++) {
        if (ObjectList[i][findIn] == toFind) {
            searchRes.push(ObjectList[i]);
        }
    }
    return searchRes;

}

// Book class main function
async function bookClass() {
    // Get form fields
    const instructorId = document.getElementById('instructorId').value;
    const bookClassName = document.getElementById('bookClassName').value;
    const bookClassEmail = document.getElementById('bookClassEmail').value;
    const datetimepicker = document.getElementById('datetimepicker').value;
    var results = datetimepicker.split(' ');

    // Get Instructor's classes list
    const instructors = await getAllClassesForInstructor(instructorId);
    if (instructors) {
        // Filter to get the date and time submitted by user 
        const dateFilteredData = await searchInObj(results[0], 'classDate', instructors);
        const timeFilteredData = await searchInObj(results[1], 'classTime', dateFilteredData);
        if (timeFilteredData.length > 0) {
            alert("Instructor is not available at this time or date. Please change the date or prefer another instructor.");
            return;
        }
    }


    // build bookClass object for Insert or Update
    // required for sending to the API
    const bookClassObj = {
        instructorId: instructorId,
        className: bookClassName,
        userEmail: bookClassEmail,
        classDate: results[0],
        classTime: results[1],
        approval: "Pending"
    }

    // url for api call
    const url = `${BASE_URL}/class`
    let httpMethod = "POST";

    // build the request object - note: POST
    // reqBodyJson added to the req body
    const request = {
        method: httpMethod,
        headers: getHeaders(),
        // credentials: 'include',
        mode: 'cors',
        // convert JS Object to JSON and add to request body
        body: JSON.stringify(bookClassObj)
    };

    // Try catch 
    try {
        // Call fetch and await the respose
        // fetch url using request object
        const response = await fetch(url, request);
        const json = await response.json();

        // Output result to console (for testing purposes) 
        alert(json.success);

        // catch and log any errors
    } catch (err) {
        console.log(err);
        return err;
    }

}


// insert New Client Into DB
async function insertNewClientIntoDB() {
    const userEmail = sessionStorage.getItem('email');
    const userNickname = sessionStorage.getItem('nickname');
    const user = await getUserWithMail(userEmail);
    if (!user) {
        const userDataObj = {
            firstName: userNickname,
            lastName: "",
            dateOfBirth: "",
            phoneNumber: "",
            email: userEmail,
            role: "user"
        }

        await insertUser(userDataObj);

    }

}

// Function which handles redirection according to the user role and membership status
async function handleRedirection() {
    await insertNewClientIntoDB();
    const email = sessionStorage.getItem('email');
    const user = await getUserWithMail(email);

    if (user.Role == "admin") {
        // redirect to admin dashboard if the user is admin
        window.location = "/adminDashboard.html";
    } else if (user.Role == "instructor") {
        // redirect to instructor dashboard if the user is instructor
        window.location = "/instructorDashboard.html";
    } else if (user.Role == "user") {

        // get if the user has membership or not
        const isMember = await hasmembership(user.Email);

        if (isMember) {
            // redirect to client dashboard if the user is client and also have a membership
            window.location = "/clientDashboard.html";
        } else {
            // redirect to buy membership page if the user is client and don't have a membership
            window.location = "/membership.html";
        }
    }

}

// insert user into database
async function insertUser(userObj) {

    // url for api call
    const url = `${BASE_URL}/user/insert`
    let httpMethod = "POST";

    // build the request object - note: POST
    // reqBodyJson added to the req body
    const request = {
        method: httpMethod,
        headers: getHeaders(),
        // credentials: 'include',
        mode: 'cors',
        // convert JS Object to JSON and add to request body
        body: JSON.stringify(userObj)
    };

    // Try catch 
    try {
        console.log(request);
        // Call fetch and await the respose
        // fetch url using request object
        const response = await fetch(url, request);
        console.log(response);

        // catch and log any errors
    } catch (err) {
        console.log(err);
        return err;
    }

}

// Buy membership by id 
async function buyMembership(id) {

    const userEmail = sessionStorage.getItem('email');
    const user = await getUserWithMail(userEmail);
    if (user) {
        const userDataObj = {
            membership: id,
            id: user.UserId,
            firstName: user.FirstName,
            lastName: user.LastName,
            dateOfBirth: user.DateOfBirth,
            phoneNumber: user.PhoneNumber,
            email: user.Email,
            role: user.Role,
        }

        await updateUser(userDataObj);
        handleRedirection();
    }
}

// update user details into db
async function updateUser(userObj) {

    // url for api call
    const url = `${BASE_URL}/user/update`
    let httpMethod = "POST";

    // build the request object - note: POST
    // reqBodyJson added to the req body
    const request = {
        method: httpMethod,
        headers: getHeaders(),
        // credentials: 'include',
        mode: 'cors',
        // convert JS Object to JSON and add to request body
        body: JSON.stringify(userObj)
    };

    // Try catch 
    try {
        console.log(request);
        // Call fetch and await the respose
        // fetch url using request object
        const response = await fetch(url, request);
        console.log(response);

        // catch and log any errors
    } catch (err) {
        console.log(err);
        return err;
    }

}



// submit query main function
async function submitQuery() {
    // Get form fields
    const userNameQuery = document.getElementById('userNameQuery').value;
    const userEmailQuery = document.getElementById('userEmailQuery').value;
    const userQuery = document.getElementById('userQuery').value;

    // build submitQueryObj object for Insert or Update
    // required for sending to the API
    const submitQueryObj = {
        userName: userNameQuery,
        userEmail: userEmailQuery,
        queryDesc: userQuery
    }

    // url for api call
    const url = `${BASE_URL}/query`
    let httpMethod = "POST";

    // build the request object - note: POST
    // reqBodyJson added to the req body
    const request = {
        method: httpMethod,
        headers: getHeaders(),
        // credentials: 'include',
        mode: 'cors',
        // convert JS Object to JSON and add to request body
        body: JSON.stringify(submitQueryObj)
    };

    // Try catch 
    try {
        // Call fetch and await the respose
        // fetch url using request object
        const response = await fetch(url, request);
        const json = await response.json();

        // Output result to console (for testing purposes) 
        console.log(json);

        // catch and log any errors
    } catch (err) {
        console.log(err);
        return err;
    }
}


// Get list of all the classes of client 
async function getAllClassesForUser(userEmail) {

    try {
        // Get a list of user classes with given email
        const classes = await getDataAsync(`${BASE_URL}/class//user/${userEmail}`);

        if (classes != null) {

            return classes;

        }
    } // catch and log any errors
    catch (err) {

        console.log(err);
    }
}



// When this script is loaded, call loadMemberships() to add memberships to the page
//loadMemberships();
loadInstructorsList();
//handleRedirection();