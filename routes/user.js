// routes/user.js
const express = require('express')
const router = express.Router()

const passport = require('passport')               // 載入 passport
const User = require('../models/user')

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 登入檢查
// 登入頁面
router.get('/login', (req, res) => {
    res.render('login')
  })
  // 登入檢查
  router.post('/login', (req, res, next) => {
    
    //可以在驗證前做點事
    //console.log('');
    passport.authenticate('local', {                        
    // 首先，我們載入 passport，然後更新「登入檢查」這個 action，讓它使用 Passport 提供的 authenticate 方法來執行認證。
      successRedirect: '/',                                         // 登入成功會回到根目錄
      failureRedirect: '/users/login'                        // 失敗會留在登入頁面
    })(req, res, next)   //

    //可以再執行後再做點事情

  })

 /*  比較以上寫法
 router.post('/login', passport.authenticate('local', {
    successRedirect: '/',                                         // 登入成功會回到根目錄
    failureRedirect: '/users/login'   
  }))
 
 */     

 /* 
 return function authenticate(req, res, next){  //原碼會傳req, res,next進去 所以上面登入前我們改用攔截式
     if(http.IncomingMessage.prototype.logIn
        && http.IncomingMessage.prototype.logIn !== IncomingMessageExt.logIn){

        }
 }
 */

 // 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 註冊檢查
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  User.findOne({ email: email }).then(user => {
    if (user) {                                       // 檢查 email 是否存在
      console.log('User already exists')      
      res.render('register', {                // 使用者已經註冊過
        name,
        email,
        password,
        password2
      })
    } else {
      const newUser = new User({    // 如果 email 不存在就直接新增
        name,
        email,
        password
      })
      newUser
        .save()
        .then(user => {
          res.redirect('/')                         // 新增完成導回首頁
        })
        .catch(err => console.log(err))      
    }
  })
})

/**
 * 我們在這邊使用了 Mongoose 提供的 findOne 方法，去尋找 User model 裡是否已經有同樣的 email。之所以使用 findOne 而不是用 find，是因為我們只需要找到一筆 email 相同的資料，就代表這個使用者已經註冊過了。

執行 findOne 後，我們用 if/else 來根據結果去執行下一步：

如果 email 在資料庫中已經存在的話，將不能送出，並回到註冊表單頁面
如果 email 在資料庫中不存在，則在資料庫新增該使用者，新增完成後導回首頁
注意：這裡有一個新指令：then。他是 JavaScript ES6 中 Promise 的語法工具之一。

User.findOne({ email: email }).then(user => {                  
Promise 到底是什麼？由於我們的應用程式 (Web Server) 和 Database 的資料溝通需要時間，而我們不知道這段過程需時多久，但在程式設計時需要考慮到這段時間差；這種情形在術語中叫做 非同步程式設計。在 Javascript ES6 中，我們可以透過 Promise 來處理這類的情況。

在之後的 《Asynchronous JavaScript》中，我們會針對 非同步處理及 Promise 進行更詳細的介紹，所以在這裡先不詳細解釋。現在，關於 .then 的使用方法，你可以理解為「當執行 findOne 後，如果沒有錯誤，我們就繼續執行 .then() 裡面 callback 的動作」。

接下來，我們來處理如果輸入的 email 已經存在的狀況。

如果使用者輸入 email 已經註冊過，我們就重新渲染註冊頁面，同時把使用者剛剛輸入的資料回傳到表單裡。
 */


// 註冊檢查
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    User.findOne({ email: email }).then(user => {
      if (user) {                                       // 檢查 email 是否存在
        console.log('User already exists')      
        res.render('register', {                // 使用者已經註冊過
          name,
          email,
          password,
          password2
        })
      } else {
        const newUser = new User({    // 如果 email 不存在就直接新增
          name,
          email,
          password
        })
        newUser
          .save()
          .then(user => {
            res.redirect('/')                         // 新增完成導回首頁
          })
          .catch(err => console.log(err))      
      }
    })
  })
  

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router

/*
這裡我們使用了在章節開始時介紹過的「解構賦值 (Object Destructuring Assignment)」。Destructuring 可以將陣列或物件中指定的資料取出成為變數。

這樣，我們就一次可以宣告多個變數，而它們的值都是從 req.body 取得。

const { name, email, password, password2 } = req.body
這樣子寫，跟下面的程式碼在程式邏輯上是同樣的意思：

const name = req.body.name
const email = req.body.email
const password = req.body.password
const password2 = req.body.password2

*/