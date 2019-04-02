let mongoose = require('mongoose')
let Schema = mongoose.Schema

let taskSchema = new Schema({
  uid: Schema.Types.ObjectId,
  title: {type: String, required: true},
  iconCode: Number,
  isRemoved: Boolean,
  isRemind: Boolean,
  remindDays: Array,
  remindTime: String
})


let Task = mongoose.model('Task', taskSchema)

module.exports = Task
