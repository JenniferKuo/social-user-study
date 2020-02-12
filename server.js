var express = require('express');
var session = require('express-session')
var bodyParser = require('body-parser')
var db = require('./db');

var app = express();

// 使用 session，要設定一個 secret key
app.use(session({
  secret: 'keyboard cat',
}))

// 有了這個才能透過 req.body 取東西
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'));

app.set('view engine', 'ejs');

// 首頁，直接輸出所有留言
app.get('/', function (req, res) {
    console.log(req.session);
    // 試著看看 session 裡面有沒有 username, 沒有就轉至登入頁面
    if(req.session.username == undefined){
        res.redirect('/login');
    }else{
        // 判斷是否是管理員
        var username = req.session.username;
        console.log(username);
        var isAdmin = false;

        if (username == "admin") {
            isAdmin = true;
        }

        res.render('forum',{
            username: username,
            isAdmin: isAdmin
        });
    }
});

// 刪除文章
app.get('/posts/delete/:id', function (req, res) {
  var id = req.params.id;
  db.deletePost(id, function (err) {
    if (err) {
      res.send(err);
    } else {

      // 成功後導回首頁
      res.redirect('/');
    }
  })
})

// 發表新文章的頁面
app.get('/posts', function (req, res) {
  res.render('newpost');
})

// 新增文章
app.post('/posts', function (req, res) {
  var author = req.session.username;
  var content = req.body.content;

  db.addPost({
    author: author,
    content: content,
    createTime: new Date()
  });
  res.redirect('/');
})

// 輸出登入頁面
app.get('/login', function (req, res) {
  res.render('login');
})

// 登入，將uid存入session
app.post('/login', function(req, res) {
    var username = req.body.username;
    req.session.username = username;
    // TODO: 管理員帳號
    if(username == "admin")
        req.session.isAdmin = true;
    else
        req.session.isAdmin = false;

    // 更新firebase的user資訊
    var user = {'username': username, 'isAdmin': req.session.isAdmin, 'like': 0, 'dislike': 0, 'postNumber': 0};
    db.login(user, function(err){
        console.log(err);
        // 跳轉回主頁
        res.redirect('/');
    });
})

// 登出，清除 session
app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/login')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})