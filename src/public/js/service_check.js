function checkService(service){
    lockButton(service);

    if (service === 'us') {
        url = 'http://localhost:3001/us/service/check'
    }
    else if (service === 'py') {
        url = 'http://localhost:3002/py/service/check'
    }
    else {
        return false;
    }
    
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'GET',
        header: {
            'Access-Control-Allow-Origin': '*' // Required for CORS support to work
        },
        success: function(data) {
            console.log(data);
            if (data.status === 'OK')
                updateStatus(service, true)
            else
                updateStatus(service, false)

            unlockButton(service);
        },
        error: function(xhr, status, err) {
            console.log(err);
            updateStatus(service, false)

            unlockButton(service);
        }
    });

    
}

function updateStatus(serviceId, status){
    if (status === true) {
        $('#'+serviceId).removeClass('bg-danger');
        $('#'+serviceId).addClass('bg-success');
        $('#'+serviceId).html('Online');
    }
    else {
        $('#'+serviceId).removeClass('bg-success');
        $('#'+serviceId).addClass('bg-danger');
        $('#'+serviceId).html('Offline');
    }
}

function lockButton(serviceId){
    $('#'+serviceId+"-btn").attr('disabled', true);
    $('#'+serviceId+"-btn").html('<i class="bi bi-hourglass-split"></i>');
}

function unlockButton(serviceId){
    $('#'+serviceId+"-btn").attr('disabled', false);
    $('#'+serviceId+"-btn").html('<i class="bi bi-arrow-clockwise"></i>');
}

function checkAllServices(){
    checkService('us');
    checkService('py');
}