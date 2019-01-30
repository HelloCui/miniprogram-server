const Task = require('../models/task')
const Today = require('../models/today')
const History = require('../models/history')
const utils = require('../utils')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

module.exports = function(api) {
  api.get('/checktoday/task', async (ctx) => {
    let result = await Task.find().exec()
    ctx.body = result
  })

  api.post('/checktoday/task', async (ctx) => {
    let task = new Task(ctx.request.body)
    await task.save()
    let today = new Today({
      task: task._id,
      date: utils.getNowDate(),
      isChecked: false
    })
    await today.save()
    ctx.body = {
      status: true
    }
  })

  api.put('/checktoday/task/:id', async (ctx) => {
    let body = ctx.request.body
    let id = ctx.params.id
    delete body.id
    let result = await Task.updateOne({
      _id: id
    }, body)
    ctx.body = {
      status: true
    }
  })

  api.delete('/checktoday/task/:id', async (ctx) => {
    let body = ctx.request.body
    let id = ctx.params.id
    let result = await Task.deleteOne({
      _id: id
    })
    ctx.body = {
      status: true
    }
  })

  api.get('/checktoday/today', async (ctx) => {
    let result = await Today.aggregate().match({
        date: utils.getNowDate()
      })
      .lookup({
        from: 'tasks',
        localField: 'task',
        foreignField: '_id',
        as: 'task'
      })
      .unwind('task')
      .project({
        _id: 0,
        id: '$_id',
        isChecked: '$isChecked',
        taskId: '$task._id',
        title: '$task.title',
        iconCode: '$task.iconCode'
      })
    ctx.body = result
  })

  api.put('/checktoday/check/:id', async (ctx) => {
    let id = ctx.params.id
    let result = await Today.updateOne({
      _id: id
    }, {
      isChecked: true,
      checkTime: new Date()
    })
    ctx.body = {
      status: true
    }
  })

  api.put('/checktoday/uncheck/:id', async (ctx) => {
    let id = ctx.params.id
    let result = await Today.updateOne({
      _id: id
    }, {
      isChecked: false,
      checkTime: null
    })
    ctx.body = {
      status: true
    }
  })

  api.get('/checktoday/history', async (ctx) => {
    let result = await Task.find().exec()
    ctx.body = result
  })
}
