// 美的通打印日志
let mongoose = require('mongoose')
let Schema = mongoose.Schema

let remoteLogSchema = new Schema({
  content: {type: String, required: true},
  createdTime: {type: Date, required: true},
})


let RemoteLog = mongoose.model('RemoteLog', remoteLogSchema)

module.exports = RemoteLog
