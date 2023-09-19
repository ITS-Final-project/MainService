$(document).ready(function(){
    getAllLogs();
});

function getAllLogs(){

    $.ajax({
        url: 'http://localhost:3000/log/list',
        type: 'GET',
        success: function(data){
            console.log(data);
            showLogLists(data)
        }
    });
}

function showLogLists(data){
    var msLogs = data.MainService;
    var aiLogs = data.AIService;
    var usLogs = data.UserService;
    // var usLogs = data.UserService;

    var msUL = document.getElementById('ms');
    fillUL(msLogs, msUL, 'MainService');
    //checkIfScrollNeeded(msUL, 'ms');

    // var usUL = document.getElementById('us');
    var aiUL = document.getElementById('ai');
    fillUL(aiLogs, aiUL, 'AIService');


    var usUL = document.getElementById('us');
    fillUL(usLogs, usUL, 'UserService');
}

function fillUL(data, UL, service){
    // Order logs by timestamp, descending
    data = data.sort(function(a, b){
        if (parseInt(a.split('_')[1]) < parseInt(b.split('_')[1])){
            return 1;
        }

        if (parseInt(a.split('_')[1]) > parseInt(b.split('_')[1])){
            return -1;
        }

        return 0;
    });

    for (i = 0; i < data.length; i++){
        var li = document.createElement('li');
        li.classList.add('list-group-item', 'list-group-flush', 'p-0');

        var log_name = data[i];
        var timestamp = log_name.split('_')[1];
        var date = new Date(parseInt(timestamp));
        date = date.toLocaleString();

        var a = document.createElement('a');
        a.setAttribute('href', `/admin/logs/${service}/${log_name}`);
        a.classList.add('list-group-item-action', 'list-group-item');

        var short_log_name = log_name.split('.')[0].split('_')[1];
        
        a.appendChild(document.createTextNode(`${short_log_name} - ${date}`));

        if (i == 0) {
            a.classList.add('active');
        }

        li.appendChild(a);
        UL.appendChild(li);
    }
}

function checkIfScrollNeeded(UL, id){
    var li = document.getElementById(id);
    if (li.length > 5){
        var scroll = document.getElementById(`${service}-scroll`);
        scroll.classList.add('scroll');
    }
}