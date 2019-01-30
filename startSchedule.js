const schedule = require('node-schedule')
const Task = require('./models/task')
const Today = require('./models/today')
const History = require('./models/history')
const utils = require('./utils')

async function moveToHistory() {
  let todayList = await Today.find().exec()
  await History.insertMany(todayList)
  await Today.deleteMany({})
  return true;
}

async function copyToToday() {
  let insertDatas = []
  let task = await Task.find().exec()
  task.forEach(item => {
    insertDatas.push({
      task: item._id,
      date: utils.getNowDate(),
      isChecked: false
    })
  })
  await Today.insertMany(insertDatas)
  return true
}

module.exports = function() {
  // 每天0点定时任务
  var preDay = schedule.scheduleJob('0 * * *', async function(){
    await moveToHistory()
    await copyToToday()
  });
}
