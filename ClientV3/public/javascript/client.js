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
                document.getElementById('memname').innerHTML = "YOU have  " + x.membershipName + "  Membership";
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
            document.getElementById('userClasses').innerHTML = `<tr><td>No Classes to display</td></tr>`;
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
                if (query1.instructorIReply)
                    row += ` <td>${query1.instructorIReply}</td>`
                else
                    row += `<td>No Instructor Replied Yet</td>`
                row += `<td><button type="button" class="btn btn-danger" onclick="deletequery(${query1.queryId})">Delete</button></td>`;
                row += '</tr>';
                return row;
            });
            // Set the innerHTML of the membershipRows root element = rows
            document.getElementById('userqueries').innerHTML = rows.join('');

        } else {
            document.getElementById('userqueries').innerHTML = `<tr><td>No Memberships to display</td></tr>`;
        }
    } // catch and log any errors
    catch (err) {
        console.log(err);
    }
}

async function deleteclass(id) {

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
            alert(err);
            return err;
        }
    }
}
async function deletequery(id) {

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
            alert(err);
            return err;
        }
    }
}


/*function returnUserQueries() {

}

function returnUserProfile() {

}
document.getElementById('memCount').innerHTML = rows.join('');  */