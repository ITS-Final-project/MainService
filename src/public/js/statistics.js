function getRegisteredUsers(){
    // Get auth token from cookie
    var token = document.cookie;
    console.log(token);
    $.ajax({
        url: 'http://localhost:3001/us/service/users',
        type: 'GET',
        data: {
            token: localStorage.getItem('auth')
        },
        success: function(data){
            $('#registeredUsers').html(data);
        }
    });
}

getRegisteredUsers();