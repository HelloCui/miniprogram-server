const RemoteLog = require('../models/remoteLog')
const Router = require('koa-router')
const router = new Router()

router.get('/remotelog', async(ctx) => {
  let query = ctx.query
  let condition = {}
  if(query.content) {
    condition.content = RegExp(query.content)
  }
  if(query.start) {
    condition.createdTime = {
      '$gte': new Date(query.start)
    }
  }
  if(query.end) {
    condition.createdTime = condition.createdTime || {}
    condition.createdTime['$lt'] = new Date(query.end)
  }
  let result = await RemoteLog.find(condition).exec()
  ctx.body = result
})

router.post('/remotelog', async(ctx) => {
  let body = ctx.request.body
  if(!body.log) {
    throw(new Error('必须包含日志内容'))
  }
  let log = new RemoteLog({
    content: body.log,
    createdTime: new Date()
  })
  await log.save()
  ctx.body = {
    status: true
  }
})

module.exports = router
