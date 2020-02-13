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
    login: function(user, cb){
      firebase.database().ref('/users/' + user.username).once('value').then(function(snapshot){
        cb(snapshot.val());
      });
    },
    addUser: function(user, cb){
      firebase.database().ref('/users/' + user.username).update(user, cb);
      console.log(user);
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

    setUserSection: function(uid, sectionValue, cb){
      var updates = {};
      updates['section'] = sectionValue;
      firebase.database().ref('/users/'+uid).update(updates, cb);
    }
}

module.exports = DB;
