let mongoose = require('mongoose')
let Schema = mongoose.Schema

let taskSchema = new Schema({
  title: {type: String, required: true},
  iconCode: Number,
})


let Task = mongoose.model('Task', taskSchema)

module.exports = Task
