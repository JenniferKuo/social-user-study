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
                alert(section);
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
    
    // 取得分數
    var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
    // 更新log資料到firebase
    addChangeSideLog(ratingValue);
    // 隱藏評分區塊
    $('.rating-stars').hide();
  });
});

function disablePost(){
    document.getElementById("disableArea").appendChild(document.getElementById("message-form"));
    document.getElementById("message-input").innerHTML = "因為您成為了影響力節點，已經完成了階段性任務，請您在位子上安靜稍待片刻";
    alert("因為您成為了影響力節點，已經完成了階段性任務，請您在位子上安靜稍待片刻");
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
    ($('#userPanel').css("display") == "block")? closePanel() : openPanel();
}

function openPanel(){
  $('#userPanel').css("display", "block");
}

function closePanel(){
  $('#userPanel').css("display", "none");
}

function pause(){
  if($('.pauseBtn').html() == "暫停遊戲"){
    $('.pauseBtn').html("繼續遊戲");
    pauseExperiment();
  }else{
    $('.pauseBtn').html("暫停遊戲");
    resumeExperiment();
  }
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

var tempLog = {}
function changeSide(postId){
    var postElement = document.getElementById(postId);
    var username = postElement.querySelector('.author').innerHTML.replace("@","");
    var content = postElement.querySelector('.content').innerHTML;

    // 暫存到global變數
    tempLog = {
        'postId': postId,
        'uid': uid,
        'byWho': username,
        'content': content
    };

    var offset = $('#'+ postId).find('.change').offset()
    $('.rating-stars').css("top", offset.top - 40);
    $('.rating-stars').css("left", offset.left + 30);
    if($('.rating-stars').css('display') == 'none')
        $('.rating-stars').show();
    else
        $('.rating-stars').hide();
}

function sortingClicked(){
  var usersRef = firebase.database().ref('users').orderByChild(sortingBy);
  usersRef.off();

  switch(sortingBy){
    case 'like':
      sortingBy = "currentScore";
      $('.sorting').html("Score");
      break;
    case 'currentScore':
      sortingBy = "like";
      $('.sorting').html("Likes");
      break;
  }
  
  
  showAllUsers(document.getElementById('userList'));
}