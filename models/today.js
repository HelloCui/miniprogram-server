const mongoose = require('mongoose')
const Schema = mongoose.Schema

let todaySchema = new Schema({
  uid: Schema.Types.ObjectId,
  task: {type: Schema.Types.ObjectId, ref: 'Task'},
  date: {type: Date, required: true},
  checkTime: Date,
  isChecked: Boolean
})

todaySchema.virtual('title').get(function() {
    return this.task.title;
});

todaySchema.virtual('iconCode').get(function() {
    return this.task.iconCode;
});

let Today = mongoose.model('Today', todaySchema)

module.exports = Today
