function classify(){
    var data = document.getElementById("mainCanvas").toDataURL("image/png");

    var trainMode = activeStateModes.includes('train');
    var label = document.getElementById('train-input').value;

    $.ajax({
        type: "POST",
        url: "/classificator/classify",
        data: {
            imgBase64: data,
            trainMode: trainMode,
            label: label
        },
        success: function(data) {
            console.log(data);
            $('#result').html(data.result);

        }
    });
}