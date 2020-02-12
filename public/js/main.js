// 抓取網頁元件
var uid;
var section;

$(document).ready( function() {
    var messageForm = $('#message-form');
    var messageInput = $('#message-input');
    uid = $('#id-input').text();
    var submitBtn = $('#submit-btn');

    // 取得該user是分類在哪個區
    getUserSection();

    window.addEventListener('load', function() {

        // 按下發表留言按鈕
        submitBtn.click(function(e) {
            e.preventDefault();
            var text = messageInput.val();
            console.log(text);
            if (text) {
                writeNewPost(uid, text);
                // 清空輸入欄位
                messageInput.val('');
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