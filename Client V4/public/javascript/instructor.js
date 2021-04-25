async function returnCardsCounts() {
    try {
        const users = await returnAllUsers();
        document.getElementById('clients').innerHTML = users.length;

        const res = await returnMemberships();
        document.getElementById('memberships').innerHTML = res.length;

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

    } // catch and log any errors
    catch (err) {
        console.log(err);
    }
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
                    i++;
                    let row = `<tr>
                    <td>${class1.className}</td>
                    <td>${class1.instructorId}</td>
                    <td>${class1.classDate}</td>
                    <td>${class1.classTime}</td>
                    <td><button type="button" class="btn btn-danger" onclick="deleteclass(${class1.classId})">Delete</button></td>`;
                    row += '</tr>';

                    return row;
                }
            });
            // Set the innerHTML of the membershipRows root element = rows
            document.getElementById('pendingDash').innerHTML = rows.join('');

        } else {
            document.getElementById('pendingDash').innerHTML = `<tr><td colspan=6>No Classes to display</td></tr>`;
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

async function returnMemberships() {
    const result = await getDataAsync(`${BASE_URL}/membership`);
    return result;
}

async function returnNewQueries() {
    const result = await getDataAsync(`${BASE_URL}/query/newqueries`);
    return result;
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
            if (check > from && check < to) {
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
                    i++;
                    let row = `<tr>
                    <td>${class1.className}</td>
                    <td>${class1.classDate}</td>
                    <td>${class1.classTime}</td>
                    <td><button type="button" class="btn btn-danger" onclick="deleteclass(${class1.classId})">Delete</button></td>`;
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
                    i++;
                    let row = `<tr>
                    <td>${class1.className}</td>
                    <td>${class1.classDate}</td>
                    <td>${class1.classTime}</td>
                    <td><button type="button" class="btn btn-danger" onclick="deleteclass(${class1.classId})">Delete</button></td>`;
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