// 抓取網頁元件
var uid;
var section;
var isActive;   
var isAdmin;

$(document).ready( function() {
    var messageForm = $('#message-form');
    var messageInput = $('#message-input');
    uid = $('#id-input').text();
    var submitBtn = $('#submit-btn');

    // 取得該user是分類在哪個區
    getUserData();
    // 隱藏回覆某人區塊
    $('#reply-container').hide();

    window.addEventListener('load', function() {

        // 按下發表留言按鈕
        submitBtn.click(function(e) {
            e.preventDefault();
            var text = messageInput.val();

            if (text) {
                writeNewPost(uid, text, $('#reply-user').html(), $('#reply-content').html());
                // 清空輸入欄位
                messageInput.val('');
                // 清空回覆欄位
                $('#reply-container').hide();
                $('#reply-user').empty();
                $('#reply-content').empty();
            }else{
                $('.alert').remove();
                var html = '<div class="alert alert-warning alert-dismissible fade show" role="alert">留言欄位不可為空<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
                $('#alert').append(html);
                setTimeout(()=>{
                    $('.alert').fadeOut('slow');
                }, 2000);
                
            }
        });
    });


});

function disablePost(){
    document.getElementById("disableArea").appendChild(document.getElementById("message-form"));
    document.getElementById("message-input").innerHTML = "您已被暫時禁止發言";
}

function enablePost(){
    document.getElementsByClassName('bg-white')[0].appendChild(document.getElementById("message-form"));
    document.getElementById("message-input").innerHTML = "";
}

function addUserBtnClicked(){
    addUser($('#inputID').val(), section);
    $('#inputID').val("");
}

function showUserPanel(){
    ($('#userPanel').css("visibility") == "visible")? $('#userPanel').css("visibility", "hidden") : $('#userPanel').css("visibility", "visible");
}

function replyPost(postId){
    $('html, body').animate({
        scrollTop: 0
    }, 300);
    var postElement = document.getElementById(postId);
    var username = postElement.querySelector('.author').innerHTML.replace("@","");
    var content = postElement.querySelector('.content').innerHTML;

    // TODO: 設置post的回覆某人欄位
    $('#reply-container').show();
    $('#reply-user').html(username);
    $('#reply-content').html(content);
}