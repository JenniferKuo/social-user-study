var myQuestions = [
	{
		question: "1.	「死刑過於殘酷，違反人權」您是否支持此論點呢?",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
	{
		question: "2.	「有冤獄的可能性，冤獄、誤判是無法挽回的」您是否支持此論點呢?",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "3.	「人有教化之可能性，應發揮在教育精神」您是否支持此論點呢?",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "4.	「死刑無法嚇阻犯罪」您是否支持此論點呢?",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
        question: "5.	「死刑不符合比例原則，終身監禁可取代」您是否支持此論點呢?意指: 終身監禁也能達到跟死刑類似的效果，此時就不該用殺人性命這種最嚴酷的手段。",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "6.	「殺人償命，一命抵一命」您是否支持此論點呢?",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "7. 我總是聚會上炒熱氣氛的人",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "8. 我對人感興趣",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "9. 我喜歡躲在人群的背後，不喜歡引人注目",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "10. 我不太健談",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "11. 我不喜歡被別人注意",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "12. 我常抽空幫助別人",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "13. 我不愛和陌生人說話",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "14. 我讓別人在和我相處時感覺很放鬆",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "",
		options: [
            {5: '非常同意'},
            {4: '同意'},
            {3: '沒意見'},
            {2: '不同意'},
            {1: '非常不同意'}
        ],
    },
    {
		question: "",
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

function sendResult(ans, score){
    var data = {"score": score};
    let id = $('#id-input').text();
    var url = "https://script.google.com/macros/s/AKfycbyABZt9bsN8ghP5LCLGeyQwJ1zp5YGbCPxjpLYFVQMU-ExnSVP7/exec";
    $.ajax({
        async: true,
        crossDomain: true,
        url: url,
        data: {
            "id": id,
            "answers": ans.toString()
            // 自動偵測填答完畢
        },
        'Access-Control-Allow-Origin': '*',
        success: function(response) {
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
      },
    });
}

function showResults(){
    var questions = myQuestions;
	var quizContainer = document.getElementById('question-container');
    var answerContainers = quizContainer.querySelectorAll('.options');
    var ans = [];
    var sum = 0;

	// 檢查每個問題選項
	for(var i=0; i<questions.length; i++){
        // 檢查是否每個問題都有回答
        if(answerContainers[i].querySelector('input[name=question'+i+']:checked') == null){
            alert("請作答所有問題");
            return;
        }
        ans.push(answerContainers[i].querySelector('input[name=question'+i+']:checked').value);
        // 加總選項分數
		sum += parseInt((answerContainers[i].querySelector('input[name=question'+i+']:checked') || 0).value);
    }
    
    // TODO: 儲存到資料庫或csv
    sendResult(ans, sum);
}