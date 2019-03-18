const schedule = require('node-schedule')
const Task = require('./models/task')
const Today = require('./models/today')
const History = require('./models/history')
const utils = require('./utils')

async function moveToHistory() {
  try {
    let todayList = await Today.find().exec()
    console.log('Inserting history at' + new Date())
    await History.insertMany(todayList)
    console.log('Insert history success. Removing today at ' + new Date())
    await Today.deleteMany({})
    console.log('Remove today success')
    return true;
  } catch (e) {
    console.error(e)
  }
}

async function copyToToday() {
  try {
    let insertDatas = []
    let task = await Task.find().exec()
    task.forEach(item => {
      insertDatas.push({
        uid: item.uid,
        task: item._id,
        date: utils.getNowDate(),
        isChecked: false
      })
    })
    console.log('Inserting today at' + new Date())
    await Today.insertMany(insertDatas)
    console.log('Insert today success' + new Date())
    return true
  } catch (e) {
    console.error(e)
  }
}

module.exports = function() {
  // 每天0点定时任务
  var preDay = schedule.scheduleJob('0 0 * * *', async function(){
    await moveToHistory()
    await copyToToday()
  });
}
