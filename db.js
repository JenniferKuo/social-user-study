var firebase = require("firebase");
require("firebase/auth");
var fs = require('fs');
var FILENAME = 'data.json';

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


var DB = {
    login: function(uid, cb){
      firebase.database().ref('/users/' + uid).once('value').then(function(snapshot){
        cb(snapshot.val());
      });
    },
    addUser: function(users, cb){
      firebase.database().ref('/users/').update(users, cb);
      console.log(users);
    },
    deleteUser: function(from, to, cb){
      var userRef = firebase.database().ref('/users/');
      for(var i=from; i<=to; i++){
        userRef.child(i).remove();
      }
      cb("Delete user successfully");
    },
    resetUser: function(cb){
      firebase.database().ref("/users/").once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          child.ref.update({
            'like': 0, 
            'dislike': 0, 
            'postNumber': 0, 
            'replyNumber': 0, 
            'isActive': true,
            'affectNumber': 0,
            'score': 0, 
            'currentScore': 0, 
          });
          if(!child.val().isAdmin){
            child.ref.update({
              'section': null,
              'changeLogs': null
            });
          }
        });
        cb("Reset all users successfully");
      });
    },
    addPost: function (post) {
          var newPostKey = firebase.database().ref().child('posts').push().key;
          post.id = newPostKey;
          var updates = {};
          updates['/posts/' + newPostKey] = post;
          firebase.database().ref().update(updates);
      },
    
    deletePost: function (id, cb) {
      DB.getPosts(function (err, posts) {
          if (err) {
            return cb(err);
          }
          var index = -1;
          for(var i = 0; i < posts.length; i++) {
            if(posts[i].id == id) {
                index = i;
                break;
            }
          }
          if (index >=0 ){
          posts.splice(index, 1);
          }
          DB.savePosts(posts, cb);
      })
    },

    savePosts: function (data, cb) {
    fs.writeFile(FILENAME, JSON.stringify(data), cb);
    },

    getPosts: function (cb) {
      firebase.database().ref().child('posts').on('value', function (snapshot) {
        cb(snapshot.val());
      });
    },

    setUserSection: function(uid, sectionValue, score, cb){
      // score是問卷分數
      var updates = {'section': sectionValue,'score': score, 'currentScore': score};
      firebase.database().ref('/users/'+uid).update(updates, cb);
    }
}

module.exports = DB;
