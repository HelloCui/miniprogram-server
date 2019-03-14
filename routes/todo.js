const Todo = require('../models/todo')
const Router = require('koa-router')
const router = new Router()

router.get('/todos', async(ctx) => {
  let result = await Todo.find({isFinished: {$ne: true}}).exec()
  ctx.body = result
})

router.get('/todos/done', async(ctx) => {
  let result = await Todo.find({isFinished: true}).exec()
  ctx.body = result
})

router.post('/todo', async(ctx) => {
  let todo = new Todo(ctx.request.body)
  await todo.save()
  ctx.body = {
    status: true
  }
})

router.put('/todo/:id', async(ctx) => {
  let body = ctx.request.body
  let id = ctx.params.id
  delete body.id
  let result = await Todo.updateOne({_id: id}, body)
  ctx.body = {
    status: true
  }
})

router.delete('/todo/:id', async(ctx) => {
  let body = ctx.request.body
  let id = ctx.params.id
  let result = await Todo.deleteOne({_id: id})
  ctx.body = {
    status: true
  }
})

module.exports = router
