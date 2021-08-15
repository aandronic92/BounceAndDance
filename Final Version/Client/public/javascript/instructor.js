async function returnPending(instructorId) {
    const result = await getDataAsync(`${BASE_URL}/class/pending/${instructorId}`);
    return result;
}

async function returnApproved(instructorId) {
    const result = await getDataAsync(`${BASE_URL}/class/approved/${instructorId}`);
    return result;
}

async function returnApprovedFiltered(instructorId, startDate, endDate) {
    const result = await getDataAsync(`${BASE_URL}/class/approved/filter/${instructorId}/${startDate}/${startDate}`);
    return result;
}

async function returnAllUsers() {
    const users = await getDataAsync(`${BASE_URL}/user/role/user`);
    return users;
}

async function returnMembershipCount() {
    const result = await getDataAsync(`${BASE_URL}/membership`);
    return result;
}

async function returnNewQueries() {
    const result = await getDataAsync(`${BASE_URL}/query/newqueries`);
    return result;
}

async function returnrepliedQueries() {
    const result = await getDataAsync(`${BASE_URL}/query/repliedqueries`);
    return result
}

/* async function returnAllUsers1() {
    const result = await getDataAsync(`${BASE_URL}/user/all`);
    return result
}
 */
async function inserNewUser() {
    const fName = document.getElementById('firstName').value;
    const lName = document.getElementById('lastName').value;
    const dob = document.getElementById('dob').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;
    const userDataObj = {
        firstName: fName,
        lastName: lName,
        dateOfBirth: dob,
        phoneNumber: phoneNumber,
        email: email,
        role: "user",
        membership: "-"
    }

    await insertUser(userDataObj);
}



async function returnCardsCounts() {
    try {
        const users = await returnAllUsers();
        document.getElementById('clients').innerHTML = users.length;

        const userEmail = sessionStorage.getItem('email');
        const instructor = await getUserWithMail(userEmail);
        const pending = await returnPending(instructor.UserId);
        if (pending)
            document.getElementById('pending').innerHTML = pending.length;

        const approved = await returnApproved(instructor.UserId);
        if (approved)
            document.getElementById('approved').innerHTML = approved.length;
        else
            document.getElementById('approved').innerHTML = 0;

        const newqueries = await returnNewQueries();
        if (newqueries)
            document.getElementById('newqueries').innerHTML = newqueries.length;
        else
            document.getElementById('newqueries').innerHTML = 0;

        const membershipcount = await returnMembershipCount();
        document.getElementById('membershipcount').innerHTML = membershipcount.length;

    } // catch and log any errors
    catch (err) {
        console.log(err);
    }
}

function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
}

async function returnTablesData() {
    try {
        const userEmail = sessionStorage.getItem('email');
        const instructor = await getUserWithMail(userEmail);
        const pending = await returnPending(instructor.UserId);
        if (pending != null) {
            i = 1;
            const rows = pending.map(class1 => {
                if (i <= 5) {
                    var myDate = new Date(class1.classDate); //you can also do milliseconds instead of the date string                    
                    
                    var myEuroDate = convertDate(myDate);
                    i++;
                    
                    let row = `<tr>
                    <td>${class1.className}</td>
                    <td>${class1.instructorId}</td>
                    <td>${myEuroDate}</td>
                    <td>${class1.classTime}</td>
                    <td><button type="button" class="btn btn-warning" onclick="approveClass(${class1.classId})">Approve</button>&nbsp;
                    <button type="button" class="btn btn-danger" onclick="denyClass(${class1.classId})">Deny</button></td>`;
                    row += '</tr>';

                    return row;
                }
            });
            // Set the innerHTML of the membershipRows root element = rows
            document.getElementById('pendingDash').innerHTML = rows.join('');

        } else {
            document.getElementById('pendingDash').innerHTML = `<tr><td colspan=5>No Classes to display</td></tr>`;
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


async function loadCalender() {

    (function($) {

        var Calendar = function(elem, options) {
            this.elem = elem;
            this.options = $.extend({}, Calendar.DEFAULTS, options);
            this.init();
        };

        Calendar.DEFAULTS = {
            datetime: undefined,
            dayFormat: 'DDD',
            weekFormat: 'DDD',
            monthFormat: 'MM/DD/YYYY',
            view: undefined,
        };

        Calendar.prototype.init = function() {
            if (!this.options.datetime || this.options.datetime == 'now') {
                this.options.datetime = moment();
            }
            if (!this.options.view) {
                this.options.view = 'month';
            }
            this.initScaffold()
                .initStyle()
                .render();
        }

        Calendar.prototype.initScaffold = function() {

            var $elem = $(this.elem),
                $view = $elem.find('.calendar-view'),
                $currentDate = $elem.find('.calendar-current-date');

            if (!$view.length) {
                this.view = document.createElement('div');
                this.view.className = 'calendar-view';
                this.elem.appendChild(this.view);
            } else {
                this.view = $view[0];
            }
            console.log($currentDate);
            console.log($currentDate);

            if ($currentDate.length > 0) {
                var dayFormat = $currentDate.data('day-format'),
                    weekFormat = $currentDate.data('week-format'),
                    monthFormat = $currentDate.data('month-format');
                this.currentDate = $currentDate[0];
                if (dayFormat) {
                    this.options.dayFormat = dayFormat;
                }
                if (weekFormat) {
                    this.options.weekFormat = weekFormat;
                }
                if (monthFormat) {
                    this.options.monthFormat = monthFormat;
                }
            }
            return this;
        }

        Calendar.prototype.initStyle = function() {
            return this;
        }

        Calendar.prototype.render = function() {
            switch (this.options.view) {
                case 'day':
                    this.renderDayView();
                    break;
                case 'week':
                    this.renderWeekView();
                    break;
                case 'month':
                    this.renderMonthView();
                    break;
                    befault: this.renderMonth();
            }
        }

        Calendar.prototype.renderMonthView = function() {

            var datetime = this.options.datetime.clone(),
                month = datetime.month();
            datetime.startOf('month').startOf('week');

            var $view = $(this.view),
                table = document.createElement('table'),
                tbody = document.createElement('tbody');

            $view.html('');
            table.appendChild(tbody);
            table.className = 'table table-bordered';

            var week = 0,
                i;
            while (week < 6) {
                tr = document.createElement('tr');
                tr.className = 'calendar-month-row';
                for (i = 0; i < 7; i++) {
                    td = document.createElement('td');
                    td.appendChild(document.createTextNode(datetime.format('D')));
                    if (month !== datetime.month()) {
                        td.className = 'calendar-prior-months-date';
                    } else {
                        td.className = 'calendar-current-months-date';
                    }
                    tr.appendChild(td);
                    datetime.add(1, 'day');
                }
                tbody.appendChild(tr);
                week++;
            }

            $view[0].appendChild(table);

            if (this.currentDate) {
                $(this.currentDate).html(
                    this.options.datetime.format(this.options.monthFormat)
                );
            }

        }

        Calendar.prototype.next = function() {
            switch (this.options.view) {
                case 'day':
                    this.options.datetime.add(1, 'day');
                    this.render();
                    break;
                case 'week':
                    this.options.datetime.endOf('week').add(1, 'day');
                    this.render();
                    break;
                case 'month':
                    this.options.datetime.endOf('month').add(1, 'day');
                    this.render();
                    break;
                default:
                    break;
            }
        }

        Calendar.prototype.prev = function() {
            switch (this.options.view) {
                case 'day':
                    break;
                case 'week':
                    break;
                case 'month':
                    this.options.datetime.startOf('month').subtract(1, 'day');
                    this.render();
                    break;
                default:
                    break;
            }
        }

        Calendar.prototype.today = function() {
            this.options.datetime = moment();
            this.render();
        }

        function Plugin(option) {
            return this.each(function() {
                var $this = $(this),
                    data = $this.data('bs.calendar'),
                    options = typeof option == 'object' && option;
                if (!data) {
                    data = new Calendar(this, options);
                    $this.data('bs.calendar', data);
                }

                switch (option) {
                    case 'today':
                        data.today();
                        break;
                    case 'prev':
                        data.prev();
                        break;
                    case 'next':
                        data.next();
                        break;
                    default:
                        break;
                }
            });
        };

        var noConflict = $.fn.calendar;

        $.fn.calendar = Plugin;
        $.fn.calendar.Constructor = Calendar;

        $.fn.calendar.noConflict = function() {
            $.fn.calendar = noConflict;
            return this;
        };

        // Public data API.
        $('[data-toggle="calendar"]').click(function() {
            var $this = $(this),
                $elem = $this.parents('.calendar'),
                action = $this.data('action');
            if (action) {
                $elem.calendar(action);
            }
        });

    })(jQuery);

    $('#calendar').calendar();
}


async function setEvents() {
    var today = new Date();

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var daysInMonth = new Date(yyyy, mm, 0).getDate();

    dateFrom = yyyy + '-' + mm + '-01';
    dateTo = yyyy + '-' + mm + '-' + daysInMonth;

    var d1 = dateFrom.split("-");
    var d2 = dateTo.split("-");

    var from = new Date(d1[0], parseInt(d1[1]) - 1, d1[2]); // -1 because months are from 0 to 11
    var to = new Date(d2[0], parseInt(d2[1]) - 1, d2[2]);

    const userEmail = sessionStorage.getItem('email');
    const instructor = await getUserWithMail(userEmail);
    const approved = await returnApproved(instructor.UserId);
    if (approved != null) {
        const rows = approved.map(class1 => {
            dateCheck = class1.classDate;
            var c = dateCheck.split("-");
            var check = new Date(c[0], parseInt(c[1]) - 1, c[2]);
            if (check >= from && check <= to) {
                $(".calendar-current-months-date").each(function() {
                    var classname = this.className;
                    if (this.classList.contains(c[2])) {
                        this.innerHTML += "<p class='event'>Class With " + class1.className + " @ " + class1.classTime + "</p>";
                    }
                    if (this.innerText == c[2]) {
                        this.classList.add(this.innerText);
                        this.innerHTML += "<p class='event'>Class With " + class1.className + " @ " + class1.classTime + "</p>";
                    }
                });

            }
        });
    }

    const pending = await returnPending(instructor.UserId);
    if (pending != null) {
        const rows = pending.map(class1 => {
            dateCheck = class1.classDate;
            var c = dateCheck.split("-");
            var check = new Date(c[0], parseInt(c[1]) - 1, c[2]);
            if (check >= from && check <= to) {
                $(".calendar-current-months-date").each(function() {
                    var classname = this.className;
                    if (this.classList.contains(c[2])) {
                        this.innerHTML += "<p class='event pending'>Class With " + class1.className + " @ " + class1.classTime + " Pending for Approval</p>";
                    }
                    if (this.innerText == c[2]) {
                        this.classList.add(this.innerText);
                        this.innerHTML += "<p class='event pending'>Class With " + class1.className + " @ " + class1.classTime + " Pending for Approval</p>";
                    }
                });

            }
        });
    }
}

async function loadInstructorClasses() {
    try {
        const userEmail = sessionStorage.getItem('email');
        const instructor = await getUserWithMail(userEmail);
        const pending = await returnPending(instructor.UserId);
        if (pending != null) {
            i = 1;
            const rows = pending.map(class1 => {
                if (i <= 5) {
                    var myDate = new Date(class1.classDate); //you can also do milliseconds instead of the date string
                    
                    // var myEuroDate = myDate.getDate() + '-' + myDate.getMonth() + '-' + myDate.getFullYear();
                    var myEuroDate = convertDate(myDate);

                    i++;
                    let row = `<tr>
                    <td>${class1.className}</td>
                    <td>${myEuroDate}</td>
                    <td>${class1.classTime}</td>
                    <td><button type="button" class="btn btn-warning" onclick="approveClass(${class1.classId})">Approve</button>&nbsp;
                    <button type="button" class="btn btn-danger" onclick="denyClass(${class1.classId})">Deny</button></td>`;
                    row += '</tr>';

                    return row;
                }
            });
            // Set the innerHTML of the membershipRows root element = rows
            document.getElementById('pendingDash').innerHTML = rows.join('');

        } else {
            document.getElementById('pendingDash').innerHTML = `<tr><td colspan=4>No Classes to display</td></tr>`;
        }
        const approved = await returnApproved(instructor.UserId);
        if (approved != null) {
            i = 1;
            const rows = approved.map(class1 => {
                if (i <= 5) {
                    var myDate = new Date(class1.classDate); //you can also do milliseconds instead of the date string
                    var myEuroDate = myDate.getDate() + '-' + myDate.getMonth() + '-' + myDate.getFullYear();
                    i++;
                    let row = `<tr>
                    <td>${class1.className}</td>
                    <td>${myEuroDate}</td>
                    <td>${class1.classTime}</td>`;
                    row += '</tr>';

                    return row;
                }
            });
            // Set the innerHTML of the membershipRows root element = rows
            document.getElementById('approvedDash').innerHTML = rows.join('');

        } else {
            document.getElementById('approvedDash').innerHTML = `<tr><td colspan=4>No Classes to display</td></tr>`;
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

async function approveClass(classId) {
    // Build the request object
    const request = {
        // set http method
        method: 'PUT',
        headers: getHeaders(),
        // credentials: 'include',
        mode: 'cors',
    };
    // Cofirm delete
    if (confirm("Are you sure?")) {
        // build the api url for deleting a membership
        const url = `${BASE_URL}/class/approve/${classId}`;
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

async function denyClass(classId) {

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
        const url = `${BASE_URL}/class/${classId}`;
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


async function returnClientsTablesData() {
    try {
        const allClients = await returnAllUsers();
        if (allClients != null) {
            const mems = await returnMembershipCount();

            const rows = allClients.map(query => {
                //alert(Object.keys(query).length);
                //alert(JSON.stringify(query));
                let row = `<tr>
                    <td>${query.FirstName}</td>
                    <td>${query.LastName}</td>
                    <td>${query.DateOfBirth}</td>
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

// insert New Client Into DB
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
        location.reload();

        // catch and log any errors
    } catch (err) {
        console.log(err);
        return err;
    }

}