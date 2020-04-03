// passport.js
 
const LocalStrategy = require('passport-local').Strategy  //引進strategy給passport使用
const FacebookStrategy = require('passport-facebook').Strategy    // 載入 passport-facebook
const mongoose = require('mongoose')
// 載入 User model
const User = require('../models/user')


/* const rex = (passport)=>{  //一個接收passport參數的函式

}

module.exports = rex;   //export 函式出去

*/


module.exports = passport => {  //export 出來的是一個函式，它需要接收一個 Passport 型態的instance
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' })
        }
        if (user.password != password) {
          return done(null, false, { message: 'Email or Password incorrect' })
        }
        return done(null, user)
      })
    })
  )

  /*
  passport.use(
    new FacebookStrategy({
      clientID: '203219314068329',
      clientSecret: 'e5e1c686a14aa230a72ffe523eef0add',
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['email', 'displayName']
/*在建立 FaceStrategy 後，我們要輸入四個參數，而他們的值就是我們一開始從 facebook for developers 網址抄下來的資料：
clientID：應用程式編號
clientSecret：應用程式密鑰
callbackURL：在用戶端 OAuth 設定的重新導向 URI，我們剛剛設定為 'http://localhost:3000/auth/facebook/callback'
profileFields：因為我們的 user schema 需要使用者的 email，而這就要到 Facebook 回傳的 profile 物件中去取。
我們建議用 console.log 把 profile._json 印出來，去分析看看 Facebook 所提供的使用者資料有哪些。
這是 Rex 老師在影片裡讀取 profile_json 時的資料。注意這些資料，他們之後有機會幫助你打造更客製化的產品！

    }, (accessToken, refreshToken, profile, done) => {
      // find and create user
      User.findOne({
        email: profile._json.email
      }).then(user => {
        // 如果 email 不存在就建立新的使用者
        if (!user) {
           // 因為密碼是必填欄位，所以我們可以幫使用者隨機產生一組密碼，然後用 bcrypt 處理，再儲存起來
          var randomPassword = Math.random().toString(36).slice(-8)
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(randomPassword, salt, (err, hash) => {
              var newUser = User({
                name: profile._json.name,
                email: profile._json.email,
                password: hash
              })
              newUser.save().then(user => {
                return done(null, user)
              }).catch(err => {
                console.log(err)
              })
            })
          )
        } else {
          return done(null, user)
        }
      })
    })
  )  */



//最後，為了要支援 session 功能，我們要貼上 Passport 提供的 serialize 與 deserialize 
  passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})



}