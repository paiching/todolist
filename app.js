const express = require('express')
const app = express()
const mongoose = require('mongoose')
// 引用 body-parser
const bodyParser = require('body-parser');
// 設定 bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// 引用 express-handlebars
const exphbs = require('express-handlebars');

// 載入PASSPORT
const passport = require('passport')



// 告訴 express 使用 handlebars 當作 template engine 並預設 layout 是 main
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
const port = 3000


// 加上 { useNewUrlParser: true }
//DATABASE
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/todo', { useNewUrlParser: true }) 
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected ！！!')
})

const session = require('express-session')
app.use(session({
  secret: 'F125017730',   // secret: 定義一組屬於你的字串做為私鑰
  resave: false,
  saveUninitialized: true,
}))


//使用passport
//要在 middleware 中使用 Passport，我們先要透過 passport.initialize() 來初始化 Passport。而至於啟動 session 功能，就是使用passport.session()。
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport); //passport 傳進instance可以省略passport裡面 app.use的設定組
/*我們可以把這些設定與使用 Passport 的程式碼都放在 app.js 裡面。但是，如同我們不久前學過的重構邏輯，
我們應該把有關 Passport 的程式邏輯獨立出來，這樣才符合「關注點分離」。
所以在這個專案，我們會新增一個名為 config 的資料夾，然後把設定 Passport 的程式碼放在一個名為 passport.js 的檔案裡。
新增 passport.js 後，我們就開始撰寫這部分的功能。
首先我們要載入 LocalStrategy模組。同時，因為 Passport 也需要去存取使用者的資料，所以我們也必須載入 User model。
然後，我們來建立一個名為 passport 的 middleware。跟過去不一樣，我們可以直接使用 module.exports = passport => {} 開始: */

// 登入後可以取得使用者的資訊方便我們在 view 裡面直接使用
/*
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})
*/
// 載入 todo model
const Todo = require('./models/todo')



// 設定路由
// 載入路由器
app.use('/', require('./routes/home'))
app.use('/todos', require('./routes/todo'))
app.use('/users', require('./routes/user'))     
app.use('/auth', require('./routes/auth'))    // 把 auth route 加進來


// Todo 首頁
// 首頁
app.get('/', (req, res) => {                    
    // 把 Todo model 所有的資料都抓回來
  Todo.find((err, todos) => {             
    if (err) return console.error(err)
    //console.log(typeof(todos))
    return res.render('index', { objects: todos })  // 將資料傳給 index 樣板
  })
})

app.get('/todos', (req, res) => {
  return res.redirect('/')
})

// 列出全部 Todo
//app.get('/todos', (req, res) => {
//  res.send('列出所有 Todo')
//})
// 新增一筆 Todo 頁面
// 新增一筆 Todo 頁面
app.get('/todos/new', (req, res) => {
  return res.render('new')
})
// 顯示一筆 Todo 的詳細內容
app.get('/todos/:id', (req, res) => {
  res.send('顯示 Todo 的詳細內容')
})
// 新增一筆  Todo
app.post('/todos', (req, res) => {
  // 建立 Todo model 實例
  const todo = new Todo({                        
    name: req.body.name,    // name 是從 new 頁面 form 傳過來
  })
  // 存入資料庫
  todo.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')  // 新增完成後，將使用者導回首頁
  })
})
// 修改 Todo 頁面
app.get('/todos/:id/edit', (req, res) => {
  res.send('修改 Todo 頁面')
})
// 修改 Todo
app.post('/todos/:id/edit', (req, res) => {
  res.send('修改 Todo')
})
// 刪除 Todo
app.post('/todos/:id/delete', (req, res) => {
  res.send('刪除 Todo')
})
// 設定 express port 3000
// ...
// setting static files
app.use(express.static('public'))

// start and listen on the Express server
app.listen(process.env.PORT || port, () =>{
    //console.log(`Express is listening on http://localhost:${port}`)
    console.log(`app is running!!!`)
})