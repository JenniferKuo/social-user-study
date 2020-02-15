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

function writeNewPost(username, content) {
  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts/' + section).push().key;

  // A post entry.
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
    replyContent: ""
  };
  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + '/' + section + '/' + newPostKey] = postData;
  console.log(postData);
  return firebase.database().ref().update(updates);
}

function getUserData(){
  // 當當前user欄位產生變化時
  firebase.database().ref('/users/' + uid).on('value', function(snapshot){
    section = snapshot.val().section;
    isActive = snapshot.val().isActive;
    isAdmin = snapshot.val().isAdmin;
    console.log(section);
    console.log(isActive);
    showAllPost(document.getElementById('post-container'));
    // 根據目前狀態是否可發言來顯示發言區塊
    isActive ? enablePost() : disablePost();
    // 如果是管理員，抓取所有user的資料
    if(isAdmin){
      console.log("admin");
      showAllUsers(document.getElementById('userList'));
    }
  });
}

function showAllUsers(containerElement){
  var usersRef = firebase.database().ref('users');
  // users 欄位如果新增
  usersRef.on('child_added', function(data) {
    console.log("child_added");
    // 只顯示不是admin的帳號
    if(!data.val().isAdmin){
      containerElement.insertBefore(createUserElement(data.key, data.val().isActive), 
      containerElement.firstChild);
    }
  });
  // users欄位內容如果更新
  usersRef.on('child_changed', function(data) {
    console.log("child_changed");
    var userElement = document.getElementById(data.key);
    userElement.getElementsByClassName('username')[0].innerHTML = data.val().username;
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
    var userElement = document.getElementById(data.key);
    userElement.parentElement.removeChild(userElement);
  });
}

// 回傳一個user欄位的html
function createUserElement(uid, isActive) {
  var html = '<li class="nav-item" id="'+ uid +'">' +
  '<a class="nav-link" href="#">' +
    '<text class="username">' + uid + '</text>' +
    '<button color="dodgerblue" class="btn user-btn p-1 mute-btn" onclick="disableUser(\''+ uid +'\')"><i class="fas fa-volume-mute"></i></button>' +
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
    // TODO: 新增admin的刪除按鈕
    var postsRef = firebase.database().ref('posts/' + section);
    // posts 欄位如果新增
    postsRef.on('child_added', function(data) {
      var author = data.val().author || '匿名';
      // 把新貼文的html元素插入再DIV中最新一個child之前
      containerElement.insertBefore(createPostElement(data.key, data.val().content, author, data.val().like, data.val().dislike, data.val().createTime), 
      containerElement.firstChild);
    });
    // posts欄位內容如果更新
    postsRef.on('child_changed', function(data) {
      var postElement = document.getElementById(data.key);
      postElement.getElementsByClassName('author')[0].innerHTML = "@" + data.val().author;
      postElement.getElementsByClassName('content')[0].innerHTML = data.val().content;
      postElement.getElementsByClassName('good-count')[0].innerHTML = data.val().like;
      postElement.getElementsByClassName('bad-count')[0].innerHTML = data.val().dislike;
      postElement.getElementsByClassName('createTime')[0].innerHTML = data.val().createTime;
    });
    // posts欄位如果有被移除貼文
    postsRef.on('child_removed', function(data) {
      var postElement = document.getElementById(data.key);
      postElement.parentElement.removeChild(postElement);
    });
}

// 回傳一個貼文的html
function createPostElement(postId, content, author, like, dislike, createTime) {

  var html = '<div class="media text-muted pt-3 post" id="'+ postId +'">' +
  '<div class="media-body pb-3 mb-0 medium lh-125 border-bottom border-gray">' +
    '<strong class="author d-block text-primary small">@' + author + '</strong>' +
    '<p class="content text-body">' + content + '</p>' +
    '<p class="text-muted small">留言時間: <span class="createTime">' + createTime + '</span></p>' +
    '<div class="btn-group">' +
      '<button type="button" class="btn btn-light like" onclick="toggleLike(\'' + postId + '\', 1)"><i class="fas fa-thumbs-up" color="blue"></i><div class="good-count">' + like + '</div></button>' +
      '<button type="button" class="btn btn-light dislike" onclick = "toggleLike(\'' + postId + '\', -1)"><i class="fas fa-thumbs-down"></i><div class="bad-count">' + dislike + '</div></button>' +
    '</div>' +
    '<button type="button" class="btn btn-link" onclick="replyPost(\''+ postId +'\')">回覆</button>' +
  '</div>' +
'</div>';


  // TODO: 如果該篇文底下的like/dislike有包含自己的uid，則把他設成按過的藍色
  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;
  return postElement;
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

function replyPost(postId){
  var postElement = document.getElementById(postId);
  var content = postElement.querySelector('.content').innerHTML;
  console.log(content);
  // TODO: 設置post的回覆某人欄位
}

function disableUser(uid){
  var userRef = firebase.database().ref('/users/' + uid);
  userRef.update({isActive: false});
}

function enableUser(uid){
  var userRef = firebase.database().ref('/users/' + uid);
  userRef.update({isActive: true});
}

function addUser(uid){
  var userRef = firebase.database().ref('/users/' + uid);
  var user = {'username': uid, 'isAdmin': false, 'like': 0, 'dislike': 0, 'postNumber': 0, 'isActive': true};
  userRef.update(user);
}

function deleteUser(uid){
  var userRef = firebase.database().ref('/users/' + uid);
  userRef.remove();
}
// TODO: 新增管理介面可新增/刪除user
// TODO: 增加隨時更新user狀態/更新post/like數
// TODO: 增加tag特定某人功能，從字串判斷是否有 @
