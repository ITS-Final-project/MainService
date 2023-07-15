const pagesize = 10;
var globalPageNumber = 0;

var userCount = 0;

$(document).ready(function(){
    searchUsers(0);
});

function getUser(id){
    
}

function searchUsers(pagenumber){

    countUsers();

    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var roles = document.getElementsByName("roles");

    var roleArray = [];
    for (var i = 0; i < roles.length; i++){
        if (roles[i].checked){
            roleArray.push(roles[i].value);
        }
    }

    console.log("roles: " + roleArray);

    var url = "http://localhost:3000/user/search";

    $.ajax({
        url: url,
        type: 'POST',
        data: {
            username: username,
            email: email,
            roles: roleArray,
            pagenumber: pagenumber,
            pagesize: pagesize
        },
        success: function(data){
            console.log(data);
            addRows(data);
        },
        error: function(data){
            console.log(data);
        }
    });

    globalPageNumber = pagenumber + 1;

}

function countUsers(){
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var roles = document.getElementsByName("roles");

    var roleArray = [];
    for (var i = 0; i < roles.length; i++){
        if (roles[i].checked){
            roleArray.push(roles[i].value);
        }
    }

    var url = "http://localhost:3000/user/count";

    $.ajax({
        url: url,
        type: 'POST',
        data: {
            username: username,
            email: email,
            roles: roleArray,
        },
        success: function(data){
            userCount = data.count;
            addPagination(data.count);
        }
    });
}

function addPagination(count){
    var pages = Math.ceil(count / pagesize);
    var pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    console.log("pages: " + pages);
    console.log("globalPageNumber: " + globalPageNumber);

    // Adds the before button if there are more than 1 page left
    if (globalPageNumber > 1){
        addBefore();
    }

    // Sets up the pagination numbers
    for (var i = 0; i < pages; i++){
        addPagItem(i + 1, isDisabled = i == globalPageNumber - 1);
    }

    // Adds the after button if there are more than 1 page left
    if (globalPageNumber < pages && pages > 1){
        addAfter();
    }
}

// Adds a pagination item (number)
function addPagItem(page, isDisabled){
    var disabled = isDisabled ? "disabled" : "";

    if (isDisabled)
        var html = `<li class="page-item ` + disabled + `"><p class="page-link">` + (page) + `</p></li>`;
    else
        var html = `<li class="page-item"><a onclick="searchUsers(`+ (page - 1) + `)" class="page-link" href="#">` + page + `</a></li>`;
    var pagination = document.getElementById("pagination");
    pagination.innerHTML += html;
}

// Adds the before button
function addBefore(){
    var html = `<li class="page-item">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>`;

    var pagination = document.getElementById("pagination");
    pagination.innerHTML += html;
}

// Adds the after button
function addAfter(){
    var html = `<li class="page-item">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>`;
    var pagination = document.getElementById("pagination");
    pagination.innerHTML += html;
}

// Adds a user row to the table
function addRow(data){
    var username = data.username;
    var email = data.email;
    var roles = data.roles;
    var created = data.created;
    var id = data.id;

    // Fix the date
    created = created.substring(0, 10);

    var selfUsername = document.getElementById("selfUsername").value;

    var row = "<tr>";
    row += "<td>" + username + "</td>";
    row += "<td>" + email + "</td>";
    row += "<td>" + paintRoles(roles) + "</td>";
    row += "<td>" + created + "</td>";
    if (!(username == selfUsername))
        row += "<td><button class='btn p-0' onclick='getUser(\""+id+"\")'>Izmeni</button> <a onclick='return confirm(\"Obriši nalog?\")' href='/admin/user/delete?id=" + id + "'>Obriši</a></td>";
    else
        row += "<td></td>";
    row += "</tr>";

    return row;
}

function paintRoles(roles){
    var html = "";

    var adminHtml = `<span class="role-admin">Admin</span>`;
    var userHtml = `<span class="role-user">User</span>`;

    for (var i = 0; i < roles.length; i++){
        if (roles[i] == 'admin')
            html += adminHtml;
        else if (roles[i] == 'user')
            html += userHtml;

    }

    return html;
}

function addRows(data){
    var tbody = document.getElementById("users-table-body");

    console.log(tbody);

    tbody.innerHTML = "";

    for (var i = 0; i < data.length; i++){
        tbody.innerHTML += addRow(data[i]);
    }
}


function getUser(id){
    // href='/admin/user/edit?id=" + id + "'

    var url = "http://localhost:3000/admin/user/get";

    $.ajax({
        url: url,
        type: 'POST',
        data: {
            id: id
        },
        success: function(data){
            openEditModal(data);
        }
    });
}

function openEditModal(data){
    $('#editUserModal').modal('show');

}