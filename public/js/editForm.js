$(document).ready( function() {
    initialQuestion();
});

function initialQuestion(){
    $.ajax({
        async: true,
        crossDomain: true,
        url: "/getFormJson",
        'Access-Control-Allow-Origin': '*',
        success: function(response) {
            $('#question-container').val(JSON.stringify(response, null, 2));
      },
    });
    $.ajax({
        async: true,
        crossDomain: true,
        url: "/getForm2Json",
        'Access-Control-Allow-Origin': '*',
        success: function(response) {
            $('#question-container2').val(JSON.stringify(response, null, 2));
      },
    });
}

function editQuestion(){
    var inputText;
    try{
        inputText = JSON.parse($('#question-container').val());
        inputText = $('#question-container').val();

        $.ajax({
            async: true,
            crossDomain: true,
            url: "/setFormJson",
            type: "POST",
            dataType: "json",
            data: {
                text: inputText
            },
            success:  function(response) {
                alert("修改成功!");
            },
        });
    }catch(err){
        alert("輸入字串無法轉成JSON格式");
    }
}

function editQuestion2(){
    var inputText;
    try{
        inputText = JSON.parse($('#question-container2').val());
        inputText = $('#question-container2').val();

        $.ajax({
            async: true,
            crossDomain: true,
            url: "/setForm2Json",
            type: "POST",
            dataType: "json",
            data: {
                text: inputText
            },
            success:  function(response) {
                alert("修改成功!");
            },
        });
    }catch(err){
        alert("輸入字串無法轉成JSON格式");
    }
}

