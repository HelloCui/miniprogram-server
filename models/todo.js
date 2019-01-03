let mongoose = require('mongoose')
let Schema = mongoose.Schema

let todoSchema = new Schema({
  title: {type: String, required: true},
  time: {type: Date, required: true},
  isFinished: {type: Boolean, default: false}
})


let Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo
