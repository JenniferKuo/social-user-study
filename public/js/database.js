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

  // TODO: 增加AB區塊
  
  // A post entry.
  var postData = {
    author: username,
    postId: newPostKey,
    content: content,
    createTime: new Date(),
    like: 0,
    dislike: 0,
    dislikeUsers: {"default": true},
    likeUsers: {"default": true}
  };
  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + '/' + section + '/' + newPostKey] = postData;
  console.log(postData);
  return firebase.database().ref().update(updates);
}

function getUserSection(){
  firebase.database().ref('/users/' + uid).once('value', function(snapshot){
    section = snapshot.val().section;
    console.log(section);
    showAllPost(document.getElementById('post-container'));
  });
}

function showAllPost(containerElement){
    // TODO: 新增admin的刪除按鈕
    var postsRef = firebase.database().ref('posts/' + section);
    // posts 欄位如果新增
    postsRef.on('child_added', function(data) {
      console.log("child_added");
      var author = data.val().author || '匿名';
      // 把新貼文的html元素插入再DIV中最新一個child之前
      containerElement.insertBefore(createPostElement(data.key, data.val().content, author, data.val().like, data.val().dislike, data.val().createTime), 
      containerElement.firstChild);
    });
    // posts欄位內容如果更新
    postsRef.on('child_changed', function(data) {
      console.log("child_changed");
      var postElement = document.getElementById(data.key);
      postElement.getElementsByClassName('author')[0].innerHTML = "@" + data.val().author;
      postElement.getElementsByClassName('content')[0].innerHTML = data.val().content;
      postElement.getElementsByClassName('good-count')[0].innerHTML = data.val().like;
      postElement.getElementsByClassName('bad-count')[0].innerHTML = data.val().dislike;
      postElement.getElementsByClassName('createTime')[0].innerHTML = data.val().createTime;
    });
    // posts欄位如果有被移除貼文
    postsRef.on('child_removed', function(data) {
      console.log("child_removed");
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

// TODO: 新增管理介面可新增/刪除user
// TODO: 增加隨時更新user狀態/更新post/like數
// TODO: 增加回覆特定某人功能
