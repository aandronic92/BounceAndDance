const HTTP_REQ_HEADERS = new Headers({
  "Accept": "application/json",
  "Content-Type": "application/json"
});

// Requests will use the GET method and permit cross origin requests
const GET_INIT = { method: 'GET', credentials: 'include', headers: HTTP_REQ_HEADERS, mode: 'cors', cache: 'default' };

// API Base URL - the server address
const BASE_URL = `http://localhost:8585`;


// Asynchronous Function getDataAsync from a url and return
async function getDataAsync(url) {
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

  if (memberships != null) {
     const rows = memberships.map(membership => {
      // returns a template string for each membership
        let row = `<tr>
            
                <td>${membership.membershipName}</td>
                <td>${membership.membershipSessions}</td>
                <td class="price">&euro;${Number(membership.membershipPrice).toFixed(2)}</td>
                <td>
                  <button class="btn btn-xs" data-toggle="modal" data-target="#MembershipFormDialog" 
                  onclick="prepareMembershipUpdate(${membership.membershipId})">
                  <span class="oi oi-pencil" data-toggle="tooltip" title="Edit Membership"></span></button>
                </td>
                <td>
                  <button class="btn btn-xs" onclick="deleteMembership(${membership.membershipId})">
                  <span class="oi oi-trash" data-toggle="tooltip" title="Delete Membership"></span></button>
                </td>
                </tr>`;

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

// Add a new product - called by form submit

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
      headers: HTTP_REQ_HEADERS,
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
      headers: HTTP_REQ_HEADERS,
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

// When this script is loaded, call loadMemberships() to add memberships to the page
loadMemberships();
