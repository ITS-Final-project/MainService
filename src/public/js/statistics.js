$(document).ready(function(){
    getRegStats();
});

function getRegStats(){
    // Get auth token from cookie
    var token = document.cookie;
    console.log(token);
    $.ajax({
        url: 'http://localhost:3000/admin/users/regstats',
        type: 'GET',
        success: function(data){
            showMonthlyUsers(data)
        }
    });
}


function showMonthlyUsers(data){
    var now = new Date();
    var nowMonth = now.getMonth();
    var sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    var monthNames = ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"];

    var monthArray = [];
    var userArray = [];

    // data {"5": 9, "6": 1, "7": 1, "8": 1, "9": 1, "10": 1}

    for (i = sixMonthsAgo.getMonth(); i <= nowMonth; i++){
        monthArray.push(monthNames[i]);
        if (data[i] === undefined){
            userArray.push(0);
        }else{
            userArray.push(data[i]);
        }
    }
    
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthArray,
            datasets: [{
                label: 'Broj registrovanih korisnika',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                data: userArray
            }]
        },
        options: {}
    });


}
