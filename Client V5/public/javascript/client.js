async function returnUserMemberships() {
    try {
        const userEmail = sessionStorage.getItem('email');
        const membership = await getDataAsync(`${BASE_URL}/user/membership/${userEmail}`);
        let mem = Object.fromEntries(
            Object.entries(membership).map(([key, value]) => [key, value])
        );
        const result = await getDataAsync(`${BASE_URL}/membership`);

        for (const x of result) {
            if (mem.membership == x.membershipId) {
                document.getElementById('memname').innerHTML = "You have  " + x.membershipName + "  Membership";
                document.querySelectorAll('[onclick="buyMembership(3)"]').hidden = true;

            }
        }
    } // catch and log any errors
    catch (err) {
        console.log(err);
    }
}

async function returnUserQueries() {
    try {
        const userEmail = sessionStorage.getItem('email');
        const queries = await getDataAsync(`${BASE_URL}/query/${userEmail}`);
        document.getElementById('myqueries').innerHTML = queries.length;
    } // catch and log any errors
    catch (err) {
        console.log(err);
    }
}

async function returnUserClasses() {
    try {
        const userEmail = sessionStorage.getItem('email');
        const classes = await getDataAsync(`${BASE_URL}/class/user/${userEmail}`);
        if (classes)
            document.getElementById('myclassescount').innerHTML = classes.length;

        if (classes != null) {
            const rows = classes.map(class1 => {
                let row = `<tr>
                    <td>${class1.className}</td>
                    <td>${class1.instructorId}</td>
                    <td>${class1.classDate}</td>
                    <td>${class1.classTime}</td>
                    <td>${class1.approval}</td>
                    <td><button type="button" class="btn btn-danger" onclick="deleteclass(${class1.classId})">Delete</button></td>`;
                row += '</tr>';

                return row;
            });
            // Set the innerHTML of the membershipRows root element = rows
            document.getElementById('userClasses').innerHTML = rows.join('');

        } else {
            document.getElementById('userClasses').innerHTML = `<tr><td colspan=6>No Classes to display</td></tr>`;
        }
    } // catch and log any errors
    catch (err) {
        alert(err);
    }
}

async function returnUserQueriesToTable() {
    try {
        const userEmail = sessionStorage.getItem('email');
        const queries = await getDataAsync(`${BASE_URL}/query/${userEmail}`);
        if (queries != null) {
            const rows = queries.map(query1 => {
                // returns a template string for each membership
                let row = `<tr>
                    <td>${query1.queryDesc}</td>`;


                if (query1.instructorId)
                    row += `<td>${query1.instructorId}</td>`
                else
                    row += `<td>No Instructor</td>`
                if (query1.instructorReply)
                    row += ` <td>${query1.instructorReply}</td>`
                else
                    row += `<td>No Instructor Replied Yet</td>`
                row += `<td><button type="button" class="btn btn-danger" onclick="deletequery(${query1.queryId})">Delete</button></td>`;
                row += '</tr>';
                return row;
            });
            // Set the innerHTML of the membershipRows root element = rows
            document.getElementById('userqueries').innerHTML = rows.join('');

        } else {
            document.getElementById('userqueries').innerHTML = `<tr><td colspan=4>No Queries to display</td></tr>`;
        }
    } // catch and log any errors
    catch (err) {
        console.log(err);
    }
}

async function deleteclass(id) {
    $('.loader').show();
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
        // build the api url for deleting a class
        const url = `${BASE_URL}/class/${id}`;
        // Try catch 
        try {
            // call the api and get a result
            const result = await fetch(url, request);
            const response = await result.json();
            // if success (true result), refresh class list
            if (response == true)
                location.reload();

            // catch and log any errors
        } catch (err) {
            $('.loader').hide();
            alert(err);
            return err;
        }
    }
}
async function deletequery(id) {
    $('.loader').show();
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
        // build the api url for deleting a query
        const url = `${BASE_URL}/query/${id}`;
        // Try catch 
        try {
            // call the api and get a result
            const result = await fetch(url, request);
            const response = await result.json();
            // if success (true result), refresh query list
            if (response == true)
                location.reload();

            // catch and log any errors
        } catch (err) {
            $('.loader').hide();
            alert(err);
            return err;
        }
    }
}

function displayClientMemberships(memberships) {

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
            let row = `<div class="col-md-4 col-sm-6">
            <div class="price-table">
                <div class="price-head">
                    <h4>${membership.membershipName}</h4>
                    <h2>&euro;${Number(membership.membershipPrice).toFixed(2)}</h2>
                </div>
                <div class="price-content">
                    <ul>
                        <li><h4>${membership.membershipSessions} Sessions</h4></li>
                    </ul>
                </div>
                <div class="price-button">
                    <a class="btn btn-xs" onclick="buyMembership(${membership.membershipId})">
                  <span class="oi oi-cart" data-toggle="tooltip" title="BUY Membership">BUY</span></a>
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

async function loadClientMemberships() {
    try {

        // Get a list of memberships
        const memberships = await getDataAsync(`${BASE_URL}/membership`);
        // Call displayMemberships(), passing the retrieved memberships list
        displayClientMemberships(memberships);
    } // catch and log any errors
    catch (err) {
        console.log(err);
    }
}




async function remainingClasses() {
    try {
        const userEmail = sessionStorage.getItem('email');
        const membership = await getDataAsync(`${BASE_URL}/user/membership/${userEmail}`);
        let mem = Object.fromEntries(
            Object.entries(membership).map(([key, value]) => [key, value])
        );
        const result = await getDataAsync(`${BASE_URL}/membership`);
        const classes = await getDataAsync(`${BASE_URL}/class/user/${userEmail}`);
        var count = Object.keys(classes).length;

        for (const x of result) {
            if (mem.membership == x.membershipId) {
                var remaining = x.membershipSessions - count;
                document.getElementById('remainingClasses').innerHTML = "You have  " + remaining + "  Sessions remaining out of " + x.membershipSessions;
                if (remaining == 0)
                    $('#upgradeMem').show();
            }
        }
    } // catch and log any errors
    catch (err) {
        console.log(err);
    }
}

// Book class main function
async function bookClientClass() {
    $('.loader').show();
    const userEmail = sessionStorage.getItem('email');
    const membership = await getDataAsync(`${BASE_URL}/user/membership/${userEmail}`);
    let mem = Object.fromEntries(
        Object.entries(membership).map(([key, value]) => [key, value])
    );
    const result = await getDataAsync(`${BASE_URL}/membership`);
    const classes = await getDataAsync(`${BASE_URL}/class/user/${userEmail}`);
    if (classes)
        var count = Object.keys(classes).length;
    else
        var count = 0;
    for (const x of result) {
        if (mem.membership == x.membershipId) {
            var remaining = x.membershipSessions - count;
        }
    }
    if (remaining > 0) {
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
            $('.loader').hide();
            location.reload();
            // catch and log any errors
        } catch (err) {
            console.log(err);
            return err;
        }


    } else {
        $('.loader').hide();
        $('#upgradeMem').show();
        alert('You have booked classes to the limit of allowed bookings in your membership');
    }

}