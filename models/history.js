let mongoose = require('mongoose')
let Schema = mongoose.Schema

let historySchema = new Schema({
  uid: Schema.Types.ObjectId, 
  task: {type: Schema.Types.ObjectId, ref: 'Task'},
  date: {type: Date, required: true},
  checkTime: Date,
  isChecked: Boolean
})


let History = mongoose.model('History', historySchema)

module.exports = History
