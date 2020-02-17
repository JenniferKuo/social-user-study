// 抓取網頁元件
var uid = "";
var section = "";
var isActive;   
var isAdmin;

$(document).ready( function() {
    var messageForm = $('#message-form');
    var messageInput = $('#message-input');
    uid = $('#id-input').text();
    var submitBtn = $('#submit-btn');

    // 取得該user是分類在哪個區
    initialUserData();
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

     /* 1. Visualizing things on Hover - See next part for action on click */
  $('#stars li').on('mouseover', function(){
    var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
   
    // Now highlight all the stars that's not after the current hovered star
    $(this).parent().children('li.star').each(function(e){
      if (e < onStar) {
        $(this).addClass('hover');
      }
      else {
        $(this).removeClass('hover');
      }
    });
    
  }).on('mouseout', function(){
    $(this).parent().children('li.star').each(function(e){
      $(this).removeClass('hover');
    });
  });
  
  
  /* 2. Action to perform on click */
  $('#stars li').on('click', function(){
    var onStar = parseInt($(this).data('value'), 10); // The star currently selected
    var stars = $(this).parent().children('li.star');
    
    for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass('selected');
    }
    
    for (i = 0; i < onStar; i++) {
      $(stars[i]).addClass('selected');
    }
    
    // JUST RESPONSE (Not needed)
    var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
    var msg = "";
    if (ratingValue > 1) {
        msg = "Thanks! You rated this " + ratingValue + " stars.";
    }
    else {
        msg = "We will improve ourselves. You rated this " + ratingValue + " stars.";
    }
    console.log(msg);
    $('.rating-stars').hide();
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

function changeSide(postId){
    var postElement = document.getElementById(postId);
    var username = postElement.querySelector('.author').innerHTML.replace("@","");
    var content = postElement.querySelector('.content').innerHTML;

    var offset = $('#'+ postId).find('.change').offset()
    $('.rating-stars').css("top", offset.top - 30);
    $('.rating-stars').css("left", offset.left + 30);
    $('.rating-stars').show();
    
}