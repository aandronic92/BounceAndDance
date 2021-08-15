// Returns an array of all the Users in our database
async function returnAllUsers() {
    const users = await getDataAsync(`${BASE_URL}/user/role/user`);
    return users;
}

// Returns an array of all the memeberships exists in our system
async function returnMembershipCount() {
    const result = await getDataAsync(`${BASE_URL}/membership`);
    return result;
}

// Returns an array of all the New Queries which have not been replied yet
async function returnNewQueries() {
    const result = await getDataAsync(`${BASE_URL}/query/newqueries`);
    return result;
}

// Returns an array of all the Replied Queries
async function returnrepliedQueries() {
    const result = await getDataAsync(`${BASE_URL}/query/repliedqueries`);
    return result
}

// Returns an array of all the Instructors in our database
async function returnAllInstructors() {
    const users = await getDataAsync(`${BASE_URL}/user/role/instructor`);
    return users;
}


//
async function returnCardsCounts() {
    try {
        const users = await returnAllUsers();
        document.getElementById('clients').innerHTML = users.length;

        const userEmail = sessionStorage.getItem('email');
        const instructor = await getUserWithMail(userEmail);

        const newqueries = await returnNewQueries();
        if (newqueries)
            document.getElementById('newqueries1').innerHTML = newqueries.length;
        else
            document.getElementById('newqueries1').innerHTML = 0;

        const membershipcount = await returnMembershipCount();
        document.getElementById('membershipcount').innerHTML = membershipcount.length;

    } // catch and log any errors
    catch (err) {
        console.log(err);
    }
}

async function returnTablesData() {
    try {
        const instructors = await returnAllInstructors();
        if (instructors != null) {

            const rows = instructors.map(query => {
                //alert(Object.keys(query).length);
                //alert(JSON.stringify(query));
                var myDate = new Date(query.DateOfBirth); //you can also do milliseconds instead of the date string
                var myEuroDate = myDate.getDate() + '-' + myDate.getMonth() + '-' + myDate.getFullYear();
                let row = `<tr>
                    <td>${query.FirstName}</td>
                    <td>${query.LastName}</td>
                    <td>${myEuroDate}</td>
                    <td>${query.PhoneNumber}</td>
                    <td>${query.Email}</td>`;

                row += `<td ><button type="button" class="btn btn-danger" onclick="deleteClient(${query.UserId})">Delete</button></td></tr>`;

                return row;

            });

            // Set the innerHTML of the membershipRows root element = rows
            document.getElementById('instructorsDash').innerHTML = rows.join('');

        } else {
            document.getElementById('instructorsDash').innerHTML = `<tr><td colspan=4>No Clients to display</td></tr>`;
        }

        const newqueries = await returnNewQueries();

        if (newqueries != null) {
            i = 1;
            const rows = newqueries.map(query => {
                if (i <= 5) {
                    i++;
                    let row = `<tr>
                    <td >${query.userName}</td>
                    <td  >${query.userEmail}</td>
                    <td >${query.queryDesc}</td>
                    <td ><button type="button" class="btn btn-danger" onclick="deleteclass(${query.queryId})">Delete</button></td>`;
                    row += '</tr>';

                    return row;
                }
            });

            // Set the innerHTML of the membershipRows root element = rows
            document.getElementById('newqueriesTable').innerHTML = rows.join('');

        } else {
            document.getElementById('newqueriesTable').innerHTML = `<tr><td colspan=6>No Queries to display</td></tr>`;
        }

    } catch (err) {
        console.log(err);
    }
}


async function returnMemberships() {
    // Get a list of memberships
    const memberships = await getDataAsync(`${BASE_URL}/membership`);

    // check user permissions
    const showUpdate = checkAuth(UPDATE_MEMBERSHIP);
    const showDelete = checkAuth(DELETE_MEMBERSHIP);

    // Show add membership button
    if (checkAuth(CREATE_MEMBERSHIP))
        $('.shouldHide').show();
    else
        $('.shouldHide').hide();

    if (memberships != null) {
        const rows = memberships.map(membership => {
            // returns a template string for each membership
            let row = `<div class="col-md-4 col-sm-6">
        <div class="price-table">
        <div class="modal fade" id="modalEditMemForm${membership.membershipId}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <!-- Header -->
                <div class="modal-header">
                    <h4 class="modal-title" id="membershipFormTitle">Edit Membership</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>

                <!-- Body - contains form inputs-->
                <!-- The id of each input matches a membership property -->
                <div class="modal-body">
                    <form id="editmembershipForm${membership.membershipId}">
                        <div class="form-group">
                            <label for="membershipName">Name:</label>
                            <input id="membershipName" type="text" class="form-control" name="membershipName" value="${membership.membershipName}">
                        </div>
                        <div class="form-group">
                            <label for="membershipSessions">Sessions:</label>
                            <input id="membershipSessions" type="number" class="form-control" name="membershipSessions" value="${membership.membershipSessions}">
                        </div>
                        <div class="form-group">
                            <label for="membershipPrice">Price:</label>
                            <input id="membershipPrice" type="number" min="0.00" max="10000.00" step="0.01" class="form-control" name="membershipPrice"  value="${membership.membershipPrice}">
                        </div>
                        <!-- membershipId is a hidden field value is not required but set = 0-->
                        <input id="membershipId" type="hidden" name="membershipId" value="${membership.membershipId}">
                    </form>
                </div>

                <!-- footer -->
                <div class="modal-footer">
                    <!-- Buttons - note onclick and data-dismiss attribtes-->
                    <button onclick=" EditMembership(${membership.membershipId})" type="button" class="btn btn-primary" data-dismiss="modal">Save</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
            <ul class="list-inline m-0 buttonGroup">
                <li class="list-inline-item">
                 <button class="btn btn-success btn-sm rounded-0" type="button" data-toggle="modal" data-target="#modalEditMemForm${membership.membershipId}"  ><i class="fa fa-edit"></i></button>
                
                 </li>
                 <li class="list-inline-item">
                 <button class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onclick="deleteMembership(${membership.membershipId})"><i class="fa fa-trash"></i></button>
              </li>
            </ul>
            <div class="price-head">
                <h4>${membership.membershipName}</h4>
                <h2>&euro;${Number(membership.membershipPrice).toFixed(2)}</h2>
            </div>
            <div class="price-content">
                <ul>
                    <li><h4>${membership.membershipSessions} Sessions</h4></li>
                </ul>
            </div>
        </div>
    </div>`;
            return row;
        });
        // Set the innerHTML of the membershipRows root element = rows
        document.getElementById('membershipClientRows').innerHTML = rows.join('');

    } else {
        document.getElementById('membershipClientRows').innerHTML = `<tr><td>No Memberships to display</td></tr>`;
    }

}

async function EditMembership(memId) {
    // url for api call
    const url = `${BASE_URL}/membership`
    let httpMethod = "PUT";

    // get new membership data as json (the request body)
    //const membershipObj = $('#editmembershipForm' + memId).serialize();
    var unindexed_array = $('#editmembershipForm' + memId).serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i) {
        indexed_array[n['name']] = n['value'];
    });


    // build the request object - note: POST
    // reqBodyJson added to the req body
    const request = {
        method: httpMethod,
        headers: getHeaders(),
        // credentials: 'include',
        mode: 'cors',
        // convert JS Object to JSON and add to request body
        body: JSON.stringify(indexed_array)
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
    returnMemberships();
}


async function deleteMembership(membershipId) {

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
        const url = `${BASE_URL}/membership/${membershipId}`;
        // Try catch 
        try {
            // call the api and get a result
            const result = await fetch(url, request);
            const response = await result.json();
            // if success (true result), refresh membership list
            if (response == true)
                location.reload();

            // catch and log any errors
        } catch (err) {
            console.log(err);
            return err;
        }
    }
}


async function updateMemberships() {
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
    returnMemberships();
}


async function returnClientsTablesData() {
    try {
        const allClients = await returnAllUsers();
        if (allClients != null) {
            const mems = await returnMembershipCount();

            const rows = allClients.map(query => {
                //alert(Object.keys(query).length);
                //alert(JSON.stringify(query));
                var myDate = new Date(query.DateOfBirth); //you can also do milliseconds instead of the date string
                var myEuroDate = myDate.getDate() + '-' + myDate.getMonth() + '-' + myDate.getFullYear();

                let row = `<tr>
                    <td>${query.FirstName}</td>
                    <td>${query.LastName}</td>
                    <td>${myEuroDate}</td>
                    <td>${query.PhoneNumber}</td>
                    <td>${query.Email}</td>`;
                if (query.membership) {
                    const rowss = mems.map(query1 => {
                        if (query1.membershipId == query.membership) {
                            row += `<td>${query1.membershipName}</td>`;
                        }
                    });
                } else {
                    row += `<td>--</td>`;
                }

                row += `<td ><button type="button" class="btn btn-danger" onclick="deleteClient(${query.UserId})">Delete</button></td></tr>`;

                return row;

            });

            // Set the innerHTML of the membershipRows root element = rows
            document.getElementById('clientsTable').innerHTML = rows.join('');
            $('#example').DataTable({
                "pagingType": "full_numbers"
            });
        } else {
            document.getElementById('clientsTable').innerHTML = `<tr><td colspan=4>No Clients to display</td></tr>`;
        }



    } catch (err) {
        console.log(err);
    }
}


async function returnInstructorsTablesData() {
    try {
        const allClients = await returnAllInstructors();
        if (allClients != null) {
            const mems = await returnMembershipCount();

            const rows = allClients.map(query => {
                //alert(Object.keys(query).length);
                //alert(JSON.stringify(query));
                var myDate = new Date(query.DateOfBirth); //you can also do milliseconds instead of the date string
                var myEuroDate = myDate.getDate() + '-' + myDate.getMonth() + '-' + myDate.getFullYear();
                let row = `<tr>
                    <td>${query.FirstName}</td>
                    <td>${query.LastName}</td>
                    <td>${myEuroDate}</td>
                    <td>${query.PhoneNumber}</td>
                    <td>${query.Email}</td>`;


                row += `<td ><button type="button" class="btn btn-danger" onclick="deleteClient(${query.UserId})">Delete</button></td></tr>`;

                return row;

            });

            // Set the innerHTML of the membershipRows root element = rows
            document.getElementById('instructorsTable').innerHTML = rows.join('');
            $('#example').DataTable({
                "pagingType": "full_numbers"
            });
        } else {
            document.getElementById('instructorsTable').innerHTML = `<tr><td colspan=4>No Clients to display</td></tr>`;
        }



    } catch (err) {
        console.log(err);
    }
}

async function returnQueriesTablesData() {
    try {
        const newqueries = await returnNewQueries();
        const userEmail = sessionStorage.getItem('email');
        const instructor = await getUserWithMail(userEmail);
        if (newqueries != null) {
            const rows = newqueries.map(query => {
                let row = `<tr>
                    <td >${query.userName}</td>
                    <td  >${query.userEmail}</td>
                    <td >${query.queryDesc}</td>
                    <td ><button type="button" class="btn btn-success" data-toggle="modal" data-target="#queryReplyForm${query.queryId}">Reply</button><div class="modal fade" id="queryReplyForm${query.queryId}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <!-- Header -->
                            <div class="modal-header">
                                <h4 class="modal-title" id="queryFormTitle">Reply</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form id="queryForm">
                                    <div class="form-group">
                                        <textarea id="instructorReply${query.queryId}" type="text" class="form-control" name="instructorReply"></textarea>
                                    </div>
                                    <input id="instructorId" type="hidden" name="instructorId" value="${instructor.UserId}">
                                </form>
                            </div>
    
                            <!-- footer -->
                            <div class="modal-footer">
                                <!-- Buttons - note onclick and data-dismiss attribtes-->
                                <button onclick="updateReply(${query.queryId})" type="button" class="btn btn-primary" data-dismiss="modal">Send</button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div></td>`;
                row += `</tr>
                    `;

                return row;

            });

            // Set the innerHTML of the membershipRows root element = rows
            document.getElementById('newqueriesTable').innerHTML = rows.join('');
            $('#example').DataTable({
                "pagingType": "full_numbers"
            });
        } else {
            document.getElementById('newqueriesTable').innerHTML = `<tr><td colspan=4>No Queries to display</td></tr>`;
        }
        const repliedQueries = await returnrepliedQueries();
        if (repliedQueries != null) {
            const rows = repliedQueries.map(query => {
                let row = `<tr>
                    <td >${query.userName}</td>
                    <td  >${query.userEmail}</td>
                    <td >${query.queryDesc}</td>
                    <td >${query.instructorReply}</td>`;
                row += `</tr>`;

                return row;

            });

            // Set the innerHTML of the membershipRows root element = rows
            document.getElementById('repliedqueriesTable').innerHTML = rows.join('');
            $('#example1').DataTable({
                "pagingType": "full_numbers"
            });
        } else {
            document.getElementById('repliedqueriesTable').innerHTML = `<tr><td colspan=4>No Queries to display</td></tr>`;
        }



    } catch (err) {
        console.log(err);
    }
}


async function updateReply(queryId) {
    // Get form fields
    const instructorId = document.getElementById('instructorId').value;
    const instructorReply = document.getElementById('instructorReply' + queryId).value;

    // build membership object for Insert or Update
    // required for sending to the API
    const replyObj = {
        instructorId: instructorId,
        queryId: queryId,
        instructorReply: instructorReply
    }
    const url = `${BASE_URL}/query/reply`
    let httpMethod = "PUT";

    const request = {
        method: httpMethod,
        headers: getHeaders(),
        // credentials: 'include',
        mode: 'cors',
        // convert JS Object to JSON and add to request body
        body: JSON.stringify(replyObj)
    };

    try {
        const response = await fetch(url, request);
        // const json = await response.json();

        alert(response);
        location.reload();

    } catch (err) {
        console.log(err);
        return err;
    }
}

// insert New Client Into DB
async function insertInstructorIntoDB() {

    var unindexed_array = $('#insertInstructorForm').serializeArray();

    var indexed_array = {};

    $.map(unindexed_array, function(n, i) {
        indexed_array[n['name']] = n['value'];
    });
    await insertUser(indexed_array);


}


async function insertClientIntoDB() {

    var unindexed_array = $('#insertClientForm').serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i) {
        indexed_array[n['name']] = n['value'];
    });

    await insertUser(indexed_array);

}


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

        const responseNew = await fetch("https://dev-bsj6as08.us.auth0.com/api/v2/users", {
                method: 'POST',
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IldwOUhnNkNfXzV3WjQzUFRKSDl3NSJ9.eyJpc3MiOiJodHRwczovL2Rldi1ic2o2YXMwOC51cy5hdXRoMC5jb20vIiwic3ViIjoiUzhIUGRCMjl4TGNsYm1MRDlBZldleGlwZlB5Z1BybHNAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LWJzajZhczA4LnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjI2NjEzMjYzLCJleHAiOjE2MjY2OTk2NjMsImF6cCI6IlM4SFBkQjI5eExjbGJtTEQ5QWZXZXhpcGZQeWdQcmxzIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOmluc2lnaHRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6bG9nc191c2VycyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgdXBkYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgdXBkYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIGRlbGV0ZTpicmFuZGluZyByZWFkOmxvZ19zdHJlYW1zIGNyZWF0ZTpsb2dfc3RyZWFtcyBkZWxldGU6bG9nX3N0cmVhbXMgdXBkYXRlOmxvZ19zdHJlYW1zIGNyZWF0ZTpzaWduaW5nX2tleXMgcmVhZDpzaWduaW5nX2tleXMgdXBkYXRlOnNpZ25pbmdfa2V5cyByZWFkOmxpbWl0cyB1cGRhdGU6bGltaXRzIGNyZWF0ZTpyb2xlX21lbWJlcnMgcmVhZDpyb2xlX21lbWJlcnMgZGVsZXRlOnJvbGVfbWVtYmVycyByZWFkOmVudGl0bGVtZW50cyByZWFkOmF0dGFja19wcm90ZWN0aW9uIHVwZGF0ZTphdHRhY2tfcHJvdGVjdGlvbiByZWFkOm9yZ2FuaXphdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGNyZWF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgcmVhZDpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBjcmVhdGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.X-BvSwwHuVndEVB4rJxyvXMpzQkytJgDH89YliXv9lr1hLYRmaVB45fSmpUUnXG_CQNs6kuuD1Mp6zKcOcHEAzuTjo6w6bVrcJUMf70zjJ_CsYZO_da4N4u6JapJBX_1hbYOcfOqigqzgEFhrl4ewD_dqCfShkZjf8v_9Ldq9w158JTAZBuNKOH6EL5P_F76za1JYxBKaTOHZ0jc6_yJDU5AR6Mi_-g26hZS_q7vZX1kSeU8-dOzxMr2bsAHZnxghuyEEjtOw1JPakDeI8AJvaLysnY5G4gO05F3UL4rDVZjSP9K6Qqtpkp0kwxawZTr4E5DV2T2FY42LO43W5TtWw'
                }),
                body: JSON.stringify({
                    "email": userObj['email'],
                    "email_verified": false,
                    "name": userObj["firstName"],
                    "nickname": userObj["firstName"],
                    "picture": "https://s.gravatar.com/avatar/9b1891ec72122d1a3c1d08be2100421e?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fni.png",
                    "connection": "Username-Password-Authentication",
                    "password": "Nikhil@123"
                })
            })
            .then((responseNew) => responseNew.text())
            .then((responseTextNew) => {

                alert("Instructor Has Been Created Please use the password Default@123 to login")
                location.reload();

            })
            .catch((error) => {
                alert(error);
            });



        // catch and log any errors
    } catch (err) {
        console.log(err);
        return err;
    }

}

async function deleteClient(UserId) {

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
        const url = `${BASE_URL}/user/${UserId}`;
        // Try catch 
        try {
            // call the api and get a result
            const result = await fetch(url, request);
            const response = await result.json();
            // if success (true result), refresh membership list
            if (response == true)
                location.reload();

            // catch and log any errors
        } catch (err) {
            console.log(err);
            return err;
        }
    }
}