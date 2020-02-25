var myQuestions = [];

$(document).ready( function() {
    initialQuestion();
});

function initialQuestion(){
    $.ajax({
        async: true,
        crossDomain: true,
        url: "/getForm2Json",
        'Access-Control-Allow-Origin': '*',
        success: function(response) {
            myQuestions = response;
            showQuestions(myQuestions, document.getElementById('question-container'));
      },
    });
}

function showQuestions(questions, quizContainer){
    var output = [];
    var options;

    // for each question
    for(var i=0; i<questions.length; i++){
        
        options = [];
        // for each available option to this question...
        for(var j=0; j<questions[i].options.length; j++){
            var score = Object.keys(questions[i].options[j])[0];

            options.push(
                '<div class="form-check">'
                    + '<input class="form-check-input" type="radio" name="question'+i+'" value='+ score + '>'
                    + '<label class="form-check-label">'
                    + questions[i].options[j][score]
                + '</label></div>'
            );
        }

        // add this question and its options to the output
        output.push(
            '<div class="card mb-3"><div class="card-body form-group.required"><p class="card-text">' + questions[i].question + '</p>'
            + '<div class="options">' + options.join('') + '</div></div></div>'
        );
    }
    // finally combine our output list into one string of html and put it on the page
    quizContainer.innerHTML = output.join('');
}

function send(answers) {
    let id = $('#id-input').text();
    let ans = answers;
    $.ajax({
        async: true,
        crossDomain: true,
        url: "https://script.google.com/macros/s/AKfycbwCUBozIVtwOh119-rD2bZMHkMxFKds4_WJQPtJQAtmDKmn3MA/exec",
        data: {
            "id": id,
            "answers": ans.toString()
        },
        'Access-Control-Allow-Origin': '*',
        success: function(response) {
            alert("送出成功! 已經收到您的回覆");
            window.location.href = "/logout";
      },
    });
  };

function showResults(){
    var questions = myQuestions;
	var quizContainer = document.getElementById('question-container');
    var answerContainers = quizContainer.querySelectorAll('.options');
    var answers = [];

	// 檢查每個問題選項
	for(var i=0; i<questions.length; i++){
        // 檢查是否每個問題都有回答
        if(answerContainers[i].querySelector('input[name=question'+i+']:checked') == null){
            alert("請作答所有問題");
            return;
        }
        answers.push(answerContainers[i].querySelector('input[name=question'+i+']:checked').value);
	}
    send(answers);
}