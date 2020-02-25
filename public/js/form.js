var myQuestions = [
	{
		question: "如果現在有兩個全球性的計畫項目，一個會給整個社會帶來變革，改善絕大多數人(99%)的生活，一個會拯救少部分的人的生命(1%)，只能選其一，從整個人類社會的角度出發，你會選擇改善絕大多數人的生活嗎？",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
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

function showResults(){
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
    
    // TODO: 儲存到資料庫或csv
    sendResult(sum);
}