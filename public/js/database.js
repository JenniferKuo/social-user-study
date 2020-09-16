'use strict';

var firebaseConfig = {
    apiKey: "AIzaSyAMcH0CaWaoU0oeRTkvBuw_kFg_KiEPjAk",
    authDomain: "social-user-study-ba64b.firebaseapp.com",
    databaseURL: "https://social-user-study-ba64b.firebaseio.com",
    projectId: "social-user-study-ba64b",
    storageBucket: "social-user-study-ba64b.appspot.com",
    messagingSenderId: "748051960090",
    appId: "1:748051960090:web:3741632176cea6882a1ca3"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function writeNewPost(username, content, replyTo, replyContent, onlyDisplayTo) {
  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts/' + section).push().key;

  // A post entry.
  console.log(username);
  var postData = {
    author: username,
    postId: newPostKey,
    content: content,
    createTime: new Date(),
    like: 0,
    dislike: 0,
    dislikeUsers: {"default": true},
    likeUsers: {"default": true},
    replyTo: replyTo,
    replyContent: replyContent,
    onlyDisplayTo: onlyDisplayTo
  };
  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + '/' + section + '/' + newPostKey] = postData;

  // 更新自己的貼文總數
  personalData['postNumber'] = personalData['postNumber'] + 1;
  uploadPersonalData(uid);


  if(replyTo != ""){
    usersTotalData[replyTo].replyNumber = parseInt(usersTotalData[replyTo].replyNumber) + 1;
    uploadUsersTotalData();
  }
  return firebase.database().ref().update(updates);
}

var personalData = {};

function initialUserData(){
  // 抓取目前用戶資料
  firebase.database().ref('/users/' + uid).on('value', function(snapshot){
    personalData = snapshot.val();
    isAdmin = snapshot.val().isAdmin;
    var currentScore = snapshot.val().currentScore;
    console.log(currentScore);
    $('#currentScore').html(currentScore);

    // 如果分區變了，顯示貼文列表
    if(section != snapshot.val().section){
      section = snapshot.val().section;
      showAllPost(document.getElementById('post-container'));
      // 如果是管理員
      if(isAdmin){
        // 顯示用戶列表
        showAllUsers(document.getElementById('userList'));
      }
    }
    if(isActive != snapshot.val().isActive){
      // 根據目前狀態是否可發言來顯示發言區塊
      isActive = snapshot.val().isActive;
      isActive ? enablePost() : disablePost();
    }
    // 監聽實驗是否暫停
    isExperimentPause();
    // 監聽實驗是否結束
    isExperimentEnd();
  });

  // 抓取用戶資料
  updateUsersTotalData();
}

function isExperimentEnd(){
  firebase.database().ref('isEnd').on('value', function(snapshot){
    var isEnd = snapshot.val();
    if(isEnd){
      window.location.href = "/form2";
    }
  });
}

function isExperimentPause(){
  firebase.database().ref('isPause').on('value', function(snapshot){
    var isPause = snapshot.val();
    if(isPause){
      $('.container').hide();
      $('.msg').show();
    }else{
      $('.container').show();
      $('.msg').hide();
    }
  });
}

// 開始實驗，將所有人轉至另一問卷頁面
function startExperiment(){
  firebase.database().ref().update({'isEnd': false}).then(() => {
    window.location.href = "/";
  });
}

// 結束實驗，將所有人轉至另一問卷頁面
function endExperiment(){
  firebase.database().ref().update({'isEnd': true});
}

// 暫停實驗
function pauseExperiment(){
  console.log("pause");
  firebase.database().ref().update({'isPause': true});
}

// 繼續實驗
function resumeExperiment(){
  console.log("resume");
  firebase.database().ref().update({'isPause': false});
}

function uploadPersonalData(uid){
  firebase.database().ref('/users/' + uid).update(personalData);
}

function uploadUsersTotalData(){
  firebase.database().ref('/users/').update(usersTotalData).then(function(){
    console.log("send");
    console.log(usersTotalData);
  });
}

var sortingBy = "like";
function showAllUsers(containerElement){
  console.log("showAllUsers");
  var usersRef = firebase.database().ref('users').orderByChild(sortingBy);
  var secondContainer = document.getElementById("otherUserList");
  // 先清空列表內容
  $('#userList').empty();
  $('#otherUserList').empty();
  // usersRef.off();

  // users 欄位如果新增
  usersRef.on('child_added', function(data) {
    console.log("child_added");
    if($('#' + data.val().username).length)
      return;
    // 只顯示不是admin 和這一分區的帳號
    if(!data.val().isAdmin && data.val().section == section){
      containerElement.insertBefore(createUserElement(data.key, data.val().isActive, data.val().like, data.val().currentScore, data.val().totalScore), 
      containerElement.firstChild);
    }
    // 另一區的user列表
    else if(!data.val().isAdmin && data.val().section != section){
      secondContainer.insertBefore(createUserElement(data.key, data.val().isActive, data.val().like, data.val().currentScore), 
      secondContainer.firstChild);
    }
  });
  // 如果like的排名變了
  usersRef.on('child_moved', function(data) {
    console.log('child moved');
    console.log(data.val().username);
    usersRef.off();
    showAllUsers(document.getElementById('userList'));
  });
  // 某user欄位內容如果更新，就更新他的狀態顯示
  usersRef.on('child_changed', function(data) {
    console.log("child_changed");
    // 如果變更的是admin的欄位，就忽略
    if(data.val().isAdmin == true)
      return;
    var userElement = document.getElementById(data.key);
    userElement.getElementsByClassName('username')[0].innerHTML = data.val().username;
    userElement.getElementsByClassName('like')[0].innerHTML = data.val().like;

    // 更改按鈕顏色
    if(data.val().isActive){
      userElement.getElementsByClassName('volume-btn')[0].style.color = "dodgerblue";
      userElement.getElementsByClassName('mute-btn')[0].style.color = "lightgrey";
    }
    else{
      userElement.getElementsByClassName('mute-btn')[0].style.color = "dodgerblue";
      userElement.getElementsByClassName('volume-btn')[0].style.color = "lightgrey";
    }
  });
  // users欄位如果有被移除
  usersRef.on('child_removed', function(data) {
    console.log("child_removed");
    if($('#' + data.key).length){
      var userElement = document.getElementById(data.key);
      userElement.parentElement.removeChild(userElement);
    }
  });
}

// 回傳一個user欄位的html
function createUserElement(uid, isActive, like, currentScore, totalScore) {
  var html = '<li class="nav-item" id="'+ uid +'">' +
  '<a class="nav-link" href="javascript: void(0)">' +
  '<i class="fa fa-circle" style="color:#ff9900"></i>' + '<span class="pr-1 score" style="color:grey">' + totalScore + '</span>' +
    '<i class="fas fa-thumbs-up" style="color:grey"></i>' + '<span class="pr-1 like" style="color:grey">' + like + '</span>' +
    '<i class="fa fa-circle" style="color:#36c1b6"></i>' + '<span class="pr-1 score" style="color:grey">' + currentScore + '</span>' +
    '<text class="username">' + uid + '</text>' +
    '<button class="btn user-btn p-1 mute-btn" onclick="disableUser(\''+ uid +'\')"><i class="fas fa-volume-mute"></i></button>' +
    '<button class="btn user-btn p-1 volume-btn" onclick="enableUser(\''+ uid +'\')"><i class="fas fa-volume-up"></i></button>' +
    '<button class="btn user-btn p-1 delete-btn" onclick="deleteUser(\''+ uid +'\')"><i class="fas fa-times"></i></button>' +
  '</a>' +
  '</li>';

  var div = document.createElement('div');
  div.innerHTML = html;
  var userElement = div.firstChild;
  if(isActive){
    userElement.getElementsByClassName('volume-btn')[0].style.color = "dodgerblue";
    userElement.getElementsByClassName('mute-btn')[0].style.color = "lightgrey";
  }
  else{
    userElement.getElementsByClassName('mute-btn')[0].style.color = "dodgerblue";
    userElement.getElementsByClassName('volume-btn')[0].style.color = "lightgrey";
  }
  return userElement;
}


function showAllPost(containerElement){
    var postsRef = firebase.database().ref('posts/' + section);
    postsRef.off();

    // 先清空留言列表
    $('#post-container').empty();

    // posts 欄位如果新增
    postsRef.on('child_added', function(data) {
      // 如果不限制貼文 或是顯示給特定使用者看並且是自己 或者是管理員才能看見
      var username = $('#id-input').text();
      if(data.val().onlyDisplayTo == "" || data.val().onlyDisplayTo == username || username.match("admin")!=null){
        console.log("post added");
        var author = data.val().author || '匿名';
        // 把新貼文的html元素插入再DIV中最新一個child之前
        containerElement.insertBefore(createPostElement(data.key, data.val().replyTo, data.val().replyContent, data.val().content, author, data.val().like, data.val().dislike, data.val().likeUsers, data.val().dislikeUsers, data.val().createTime), 
        containerElement.firstChild);
      }
    });
    // posts欄位內容如果更新
    postsRef.on('child_changed', function(data) {
      console.log("post changed");
      var postElement = document.getElementById(data.key);
      postElement.getElementsByClassName('author')[0].innerHTML = "@" + data.val().author;
      postElement.getElementsByClassName('content')[0].innerHTML = data.val().content;
      postElement.getElementsByClassName('good-count')[0].innerHTML = data.val().like;
      postElement.getElementsByClassName('bad-count')[0].innerHTML = data.val().dislike;
      postElement.getElementsByClassName('createTime')[0].innerHTML = data.val().createTime;
      
      // 更新按鈕顏色
      $('#'+data.key).find('.like').css('color', 'black');
      $('#'+data.key).find('.dislike').css('color', 'black');
      if(uid in data.val().likeUsers)
        $('#'+data.key).find('.like').css('color', 'dodgerblue');
      else if(uid in data.val().dislikeUsers)
        $('#'+data.key).find('.dislike').css('color', 'dodgerblue');

      // 更新user的like數
      usersTotalData[data.val().author].like = data.child("likeUsers").numChildren() - 1;
      // 更新user的dislike數
      usersTotalData[data.val().author].dislike = data.child("dislikeUsers").numChildren() - 1;
      // 更新讚數+改變立場總分
      usersTotalData[data.val().author].totalScore = parseInt(usersTotalData[data.val().author].like) + parseInt(usersTotalData[data.val().author].affectNumber);
      uploadUsersTotalData();
    });
    // posts欄位如果有被移除貼文
    postsRef.on('child_removed', function(data) {
      var postElement = document.getElementById(data.key);
      postElement.parentElement.removeChild(postElement);
    });
}

var usersTotalData = {};
function updateUsersTotalData(){
  // likeUsers, dislikeUsers, replyTo
  var usersRef = firebase.database().ref('users');
  usersRef.on('value', function(snapshot){
    usersTotalData = snapshot.val();
    console.log(usersTotalData);
  });
}

// 回傳一個貼文的html
function createPostElement(postId, replyTo, replyContent, content, author, like, dislike, likeUsers, dislikeUsers, createTime) {
  if(replyTo != ""){
    var replyHtml = '<div class="small text-muted quote" id="reply-container">' +
    '<p class="mb-0 mt-2">回覆 @'+ replyTo +'</p>' +
    '<p class="mb-2">'+ replyContent +'</p>' +
    '</div>';
  }else{
    var replyHtml = "";
  }

  var html = '<div class="media text-muted pt-3 post" id="'+ postId +'">' +
  '<div class="media-body pb-3 mb-0 medium lh-125 border-bottom border-gray">' +
    '<strong class="author d-block text-primary small">@' + author + '</strong>' +
    replyHtml +
    '<p class="content text-body">' + content + '</p>' +
    '<p class="text-muted small">留言時間: <span class="createTime">' + createTime + '</span></p>';
  
  // 只能按讚不是自己發布的貼文
  if(author != uid){
    html += '<div class="btn-group">';
    // 如果有按過讚/噓 按鈕變成藍色
    if(uid in likeUsers){
      html +=
      '<button style="color: dodgerblue" type="button" class="btn btn-light like" onclick="toggleLike(\'' + postId + '\', 1)"><i class="fas fa-thumbs-up"></i><div class="good-count">' + like + '</div></button>' +
      '<button type="button" class="btn btn-light dislike" onclick = "toggleLike(\'' + postId + '\', -1)"><i class="fas fa-thumbs-down"></i><div class="bad-count">' + dislike + '</div></button>';
    }else if(uid in dislikeUsers){
      html +=
      '<button type="button" class="btn btn-light like" onclick="toggleLike(\'' + postId + '\', 1)"><i class="fas fa-thumbs-up"></i><div class="good-count">' + like + '</div></button>' +
      '<button style="color: dodgerblue" type="button" class="btn btn-light dislike" onclick = "toggleLike(\'' + postId + '\', -1)"><i class="fas fa-thumbs-down"></i><div class="bad-count">' + dislike + '</div></button>';
    }else{
      html +=
      '<button type="button" class="btn btn-light like" onclick="toggleLike(\'' + postId + '\', 1)"><i class="fas fa-thumbs-up"></i><div class="good-count">' + like + '</div></button>' +
      '<button type="button" class="btn btn-light dislike" onclick = "toggleLike(\'' + postId + '\', -1)"><i class="fas fa-thumbs-down"></i><div class="bad-count">' + dislike + '</div></button>';
    }
    html +=
    '</div>' +
    '<button type="button" class="btn btn-link" onclick="replyPost(\''+ postId +'\')">回覆</button>' +
    '<button type="button" class="btn btn-link change" onclick="changeSide(\''+ postId +'\')">這改變了我的立場</button>';
    
  }else{
    html += '<div class="btn-group">' +
      '<button disabled type="button" class="btn btn-light like" onclick="toggleLike(\'' + postId + '\', 1)"><i class="fas fa-thumbs-up"></i><div class="good-count">' + like + '</div></button>' +
      '<button disabled type="button" class="btn btn-light dislike" onclick = "toggleLike(\'' + postId + '\', -1)"><i class="fas fa-thumbs-down"></i><div class="bad-count">' + dislike + '</div></button>' +
    '</div>' +
    '<button type="button" class="btn btn-link" onclick="replyPost(\''+ postId +'\')">回覆</button>';
  }

  if(isAdmin){
    html += '<button style="color:red" type="button" class="btn btn-link" onclick="deletePost(\''+ postId +'\')">刪除</button>';
  }
  
  html +=   '</div></div>';

  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;
  return postElement;
}

// admin可以刪除貼文
function deletePost(postId){
  var postRef = firebase.database().ref('/posts/' + '/' + section);
  postRef.child(postId).remove();
}

function toggleLike(postId, likeValue) {
  var post;
  var postRef = firebase.database().ref('/posts/' + '/' + section + '/' + postId);

  postRef.once('value', function(snapshot) {
    if(snapshot){
      post = snapshot.val();
      switch(likeValue) {
        // 如果是按dislike
        case -1:
          // 如果還沒按過
          if (post.dislikeUsers && post.dislikeUsers[uid] == undefined) { 
            post.dislike++;
            post.dislikeUsers[uid] = true;
          }else if(post.dislikeUsers[uid] != undefined){
            post.dislike--;
            delete post.dislikeUsers[uid];
          }

          // 如果本來有按like，要把他收回
          if (post.likeUsers && post.likeUsers[uid] != undefined) {
            post.like--;
            delete post.likeUsers[uid];
          }
          break;
        // 如果是按like
        case 1:
          // 如果還沒按過
          if (post.likeUsers && post.likeUsers[uid] == undefined) {
            post.like++;
            post.likeUsers[uid] = true;
          }else if(post.likeUsers[uid] != undefined){
            post.like--;
            delete post.likeUsers[uid];
          }

          // 如果本來有按dislike，要把他收回
          if (post.dislikeUsers && post.dislikeUsers[uid] != undefined) {
            post.dislike--;
            delete post.dislikeUsers[uid];
          }
          break;
      }
      postRef.update(post);
    }

  }); 
}

function disableUser(uid){
  var userRef = firebase.database().ref('/users/' + uid);
  userRef.update({isActive: false});
}

function enableUser(uid){
  var userRef = firebase.database().ref('/users/' + uid);
  userRef.update({isActive: true});
}

function addUser(uid, section){
  if(uid == "")
    return;
  var userRef = firebase.database().ref('/users/' + uid);
  var user = {'username': uid, 'isAdmin': false, 'like': 0, 'dislike': 0, 'postNumber': 0, 'replyNumber': 0, 'affectNumber': 0, 'isActive': true, 'section': section, 'currentScore': 0, 'score': 0, 'totalScore': 0};
  userRef.update(user);
}

function deleteUser(uid){
  var userRef = firebase.database().ref('/users/');
  userRef.child(uid).remove();
}

function switchSection(){
  var userRef = firebase.database().ref('/users/' + uid);
  var newSection = "";
  section == "A"? newSection = "B" : newSection = "A";
  var user = {'section': newSection};
  userRef.update(user);
}

function pauseExperiment(){

}

function addChangeSideLog(ratingScore){
  var newLogKey = firebase.database().ref('/users/' + uid + '/changeLogs').push().key;
  var log = {
    'timestamp': new Date(),
    'postId': tempLog.postId,
    'byWho': tempLog.byWho,
    'content': tempLog.content,
    'sideScore': ratingScore
  };
  var logRef = firebase.database().ref('/users/' + uid + '/changeLogs/' + newLogKey);
  logRef.update(log);
  firebase.database().ref('/users/' + uid).update({"currentScore": ratingScore});
  $('#currentScore').html(ratingScore);

  // 也幫被贊同/不贊同的user，增加一筆改變別人立場的紀錄
  usersTotalData[tempLog.byWho].affectNumber = parseInt(usersTotalData[tempLog.byWho].affectNumber) + 1;
  // 該user的總分(改變別人立場+讚數)加一
  usersTotalData[tempLog.byWho].totalScore = parseInt(usersTotalData[tempLog.byWho].totalScore) + 1;
  console.log(usersTotalData[tempLog.byWho].affectNumber);
  console.log(usersTotalData[tempLog.byWho].totalScore);
  uploadUsersTotalData();
}

function mergeAllUsers(){
  firebase.database().ref("/users/").once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      child.ref.update({
        'section': 'C'
      });
    });
  });
  $('#mergeBtn').hide();
  $('#splitBtn').show();
}

function splitAllUsers(){
  var THRESHOLD = 15;
  var section;
  firebase.database().ref("/users/").once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      if(child.val().currentScore > THRESHOLD)
        section = 'A';
      else if(child.val().currentScore < THRESHOLD)
        section = 'B';
      else if(child.val().currentScore < THRESHOLD){
        Math.floor(Math.random() * 2)? section = 'A' : section = 'B';
      }else{
        section = 'C';
      }

      child.ref.update({
        'section': section
      });
    });
  });
  $('#mergeBtn').show();
  $('#splitBtn').hide();
}

