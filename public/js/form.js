var myQuestions = [
	{
		question: "你喜歡吃什麼水果?",
		options: {
			3: '蘋果',
			2: '橘子',
			1: '香蕉'
		},
	},
	{
		question: "你喜歡什麼動物?",
		options: {
			3: '狗狗',
			1: '小雞',
			2: '貓貓'
		}
	}
];

$(document).ready( function() {

    showQuestions(myQuestions, document.getElementById('question-container'));

    function showQuestions(questions, quizContainer){
        var output = [];
        var options;
    
        // for each question
        for(var i=0; i<questions.length; i++){
            
            options = [];
            // for each available option to this question...
            for(score in questions[i].options){
                options.push(
                    '<div class="form-check">'
                        + '<input class="form-check-input" type="radio" name="question'+i+'" value='+ score + '>'
                        + '<label class="form-check-label">'
                        + questions[i].options[score]
                    + '</label></div>'
                );
            }
    
            // add this question and its options to the output
            output.push(
                '<div class="card mb-3"><div class="card-body form-group"><p class="card-text">' + questions[i].question + '</p>'
                + options.join('') + '</div></div>'
            );
        }
        // finally combine our output list into one string of html and put it on the page
        document.getElementById('question-container').innerHTML = output.join('');
    }
    
    function sendResult(){
        var data = {"result": [1,2,3,0,4]};
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
            }
        });
    }
});
