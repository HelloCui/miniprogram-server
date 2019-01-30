let mongoose = require('mongoose')
let Schema = mongoose.Schema
var ObjectId = mongoose.Schema.Types.ObjectId;

let historySchema = new Schema({
  task: {type: Schema.Types.ObjectId, ref: 'Task'},
  date: {type: Date, required: true},
  checkTime: Date,
  isChecked: Boolean
})


let History = mongoose.model('History', historySchema)

module.exports = History
