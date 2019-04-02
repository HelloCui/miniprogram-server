const Task = require('../models/task')
const Today = require('../models/today')
const History = require('../models/history')
const utils = require('../utils')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const Router = require('koa-router')
const router = new Router()

router.get('/checktoday/task', async (ctx) => {
  let result = await Task.find({uid: ObjectId(ctx.passUser.uid), isRemoved: {$ne: true}}).exec()
  ctx.body = result
})

router.get('/checktoday/task/:id', async (ctx) => {
  let result = await Task.findOne({uid: ObjectId(ctx.passUser.uid), _id: ctx.params.id, isRemoved: {$ne: true}}).exec()
  ctx.body = result
})

router.get('/checktoday/task/remind', async (ctx) => {
  let result = await Task.find({uid: ObjectId(ctx.passUser.uid), isRemoved: {$ne: true}, isRemind: true}).exec()
  ctx.body = result
})

router.post('/checktoday/task', async (ctx) => {
  let task = new Task(Object.assign({}, ctx.request.body, {uid: ObjectId(ctx.passUser.uid)}))
  console.log(task)
  await task.save()
  let today = new Today({
    uid: ObjectId(ctx.passUser.uid),
    task: task._id,
    date: utils.getNowDate(),
    isChecked: false
  })
  await today.save()
  ctx.body = {
    status: true
  }
})

router.put('/checktoday/task/:id', async (ctx) => {
  let body = ctx.request.body
  let id = ctx.params.id
  delete body.id
  let result = await Task.updateOne({
    _id: id,
    uid: ObjectId(ctx.passUser.uid)
  }, body)
  ctx.body = {
    status: true
  }
})

router.delete('/checktoday/task/:id', async (ctx) => {
  let id = ctx.params.id
  let result = await Task.updateOne({
    _id: id,
    uid: ObjectId(ctx.passUser.uid)
  }, {
    isRemoved: true
  })
  ctx.body = {
    status: true
  }
})

router.get('/checktoday/today', async (ctx) => {
  let result = await Today.aggregate().match({
      uid: ObjectId(ctx.passUser.uid),
      date: utils.getNowDate()
    })
    .lookup({
      from: 'tasks',
      localField: 'task',
      foreignField: '_id',
      as: 'task'
    })
    .match({
      'task.isRemoved': {$ne: true}
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

router.put('/checktoday/check/:id', async (ctx) => {
  let id = ctx.params.id
  let result = await Today.updateOne({
    _id: id,
    uid: ObjectId(ctx.passUser.uid)
  }, {
    isChecked: true,
    checkTime: new Date()
  })
  ctx.body = {
    status: true
  }
})

router.put('/checktoday/uncheck/:id', async (ctx) => {
  let id = ctx.params.id
  let result = await Today.updateOne({
    _id: id,
    uid: ObjectId(ctx.passUser.uid)
  }, {
    isChecked: false,
    checkTime: null
  })
  ctx.body = {
    status: true
  }
})

router.get('/checktoday/history', async (ctx) => {
  let result = await History.find({uid: ObjectId(ctx.passUser.uid)}).exec()
  ctx.body = result
})

module.exports = router
