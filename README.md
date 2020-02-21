# Social-user-study

### 功能

- 流程: 問卷填答 -> (自動計算分數) -> 將意見群體分流到二至多個聊天室 -> (形成同溫層) -> 整併到大聊天室
- 可追蹤每個帳戶留言的按讚、被按讚等資訊，找出意見領袖
- 可以任意移除或新增帳戶

### 介面
<!-- 本地端圖片無法顯示 -->
- 登入畫面
![](./img/interface/forum.PNG)
- 問卷介面
![](./img/interface/survey.PNG)
- 討論區
![](./img/interface/forum.PNG)
- 後臺管理介面(用firebase)
![](./img/interface/backend.PNG)
<img src="img/interface/backend.PNG" width="50%">

### 使用方法

- 安裝所需套件(需安裝好node.js)    
    - `npm install`    
- 運行server    
    - `node server.js`    
    - 打開 http://localhost:3000/ 即可使用

-  新增使用者
    - 打開 http://localhost:3000/addUser

-  問卷
    - 打開 http://localhost:3000/form

-  留言區
    - 打開 http://localhost:3000/

--- 

### 後續網站管理者需要注意事項

- 需要稍微熟悉一下javascript的語法
- 需要更改表單內容，到form.js中改json檔
- 為了分配兩個聊天室的人數，要調整計算立場分數的門檻值，到database.js更改threshold值


