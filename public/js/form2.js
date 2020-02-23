var myQuestions = [
	{
		question: "你覺得今天的實驗好玩嗎?",
		options: [
            {5: '非常棒'},
            {4: '棒'},
            {3: '普通'},
            {2: '爛'},
            {1: '超級爛'}
        ],
    }
];

$(document).ready( function() {
    showQuestions(myQuestions, document.getElementById('question-container'));
});

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

function sendResult(score){
    var data = {"score": score};
    $.ajax({
        async: true,
        crossDomain: true,
        url: "/sendResult",
        type: 'post',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        dataType: 'json',
        // 結果成功回傳
        success: function (result) {
            console.log(result);
            location.href = "/";
        }
    });
}

function showResults(resultsContainer){
    var questions = myQuestions;
	var quizContainer = document.getElementById('question-container');
	var answerContainers = quizContainer.querySelectorAll('.options');
    var sum = 0;

	// 檢查每個問題選項
	for(var i=0; i<questions.length; i++){
        // 檢查是否每個問題都有回答
        if(answerContainers[i].querySelector('input[name=question'+i+']:checked') == null){
            alert("請作答所有問題");
            return;
        }
        // 加總選項分數
		sum += parseInt((answerContainers[i].querySelector('input[name=question'+i+']:checked') || 0).value);
	}
    sendResult(sum);
}