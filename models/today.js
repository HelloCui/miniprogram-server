const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId;

let todaySchema = new Schema({
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
