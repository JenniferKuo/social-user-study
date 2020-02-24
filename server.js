const THRESHOLD = 3;
var express = require('express');
var session = require('express-session')
var bodyParser = require('body-parser')
var cors = require('cors')
var db = require('./db');

var app = express();

// 使用 session，要設定一個 secret key
app.use(session({
  secret: 'keyboard cat',
}))

// 有了這個才能透過 req.body 取東西
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Access Cross Origin Resource Sharing
app.use(cors());

app.use(express.static('public'));

app.set('view engine', 'ejs');

// 首頁，直接輸出所有留言
app.get('/', function (req, res) {
    // 試著看看 session 裡面有沒有 username, 沒有就轉至登入頁面
    if(req.session.username == undefined){
        res.redirect('/login');
    }else{
        // 判斷是否是管理員
        var username = req.session.username;
        var isAdmin = req.session.isAdmin;

        if (username == "admin") {
            isAdmin = true;
        }
        console.log(req.session);
        console.log(username +" " +isAdmin);
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

// 增加使用者頁面
app.get('/addUser', function (req, res) {
    res.render('addUser');
})

// 新增使用者
app.post('/addUser', function(req, res) {
    var username = req.body.username;
    // 更新firebase的user資訊
    var user = {'username': username, 'isAdmin': false, 'like': 0, 'dislike': 0, 'postNumber': 0, 'isActive': true};
    db.addUser(user, function(data){
        console.log(data);
        res.send({
            status: 'SUCCESS'
        });
    });
})

// 輸出登入頁面
app.get('/login', function (req, res) {
    res.render('login',{
        loginFailed: false
    });
})

// 輸出問卷頁面
app.get('/form', function (req, res) {
    // 試著看看 session 裡面有沒有 username, 沒有就轉至登入頁面
    if(req.session.username == undefined){
        res.redirect('/login');
    }else{
        // 判斷是否是管理員
        var username = req.session.username;
        var isAdmin = req.session.isAdmin;

        if (username == "admin") {
            isAdmin = true;
        }

        res.render('form',{
            username: username,
            isAdmin: isAdmin
        });
    }
})

// 輸出結束問卷頁面
app.get('/form2', function (req, res) {
    // 試著看看 session 裡面有沒有 username, 沒有就轉至登入頁面
    if(req.session.username == undefined){
        res.redirect('/login');
    }else{
        // 判斷是否是管理員
        var username = req.session.username;
        var isAdmin = req.session.isAdmin;

        if (username == "admin") {
            isAdmin = true;
        }

        res.render('form2',{
            username: username,
            isAdmin: isAdmin
        });
    }
})

// 登入，將uid存入session
app.post('/login', function(req, res) {
    var uid = req.body.username;

    db.login(uid, function(data){
        console.log(data);
        // 如果firebase有資料
        if(data != null){
            // 將資料存入session
            req.session.username = uid;
            req.session.isAdmin = data.isAdmin;
            console.log(data.section);

            // 如果已經有分區資料，就跳轉回主頁
            if(data.section){
                req.session.section = data.section;
                res.redirect('/');
            }
            // 去問卷頁
            else{
                res.redirect('/form');
            }
        }
        else{
            res.render('login',{
                loginFailed: true
            });
        }
    });
})

app.post('/sendResult', function(req, res) {
    var score = req.body.score;
    var section;
    console.log(score);

    // TODO: 中間的改成random
    if(score > THRESHOLD){
        section = "A";
    }else{
        section = "B";
    }
    
    // TODO: 更改用戶資料
    db.setUserSection(req.session.username, section, score, function(err){
        if(err){
            
        }else{
            console.log(req.session.username + "update finished");
            res.send({status: "success", score: score, section: section});
        }
    });
})

// 登出，清除 session
app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/login');
})

app.get('/sheet', function(req, res){
    res.render('sheet');
})

// 動態port number
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port ' + port);
})