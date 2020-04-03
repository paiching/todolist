// model/todo.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    default: false
  },
  // 加入 userId，建立跟 User 的關聯
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})

module.exports = mongoose.model('Todo', todoSchema)

/*
在這裡，我們使用了 Mongoose 提供的 Populate 功能。Populate 讓我們建立不同 collections 之間的關聯。在操作一份文件時，它的內容可以是從另一個 collection 的文件來的。

透過上面的程式碼，我們對 todo 裡 userId 這個屬性作了以下的設定：

type（資料型別）：定義為一個 Mongoose 的 ObjectId
ref （參考）：定義這個屬性是從 User 這個 model 裡取得
index（索引）： 把 userId 設定成「索引 (index)」。MongoDB 支援 index 功能，使用 index 來查詢資料能夠增加讀取效能。
這個 index 的意思是：使 userId 能夠使用 MongoDB 提供的 index 功能，進而提升讀取資料的效能。（我們稍後會在延伸閱讀中提供有關 MongoDB 的 Index 功能的參考資料。）

用到 index 功能後，會建議在 mongoose 啟動連線時，加入 useCreateIndex: true 設定項：

*/