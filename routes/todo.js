const Todo = require('../models/todo')

module.exports = function (api) {
  api.get('/todos', async(ctx) => {
    let result = await Todo.find({isFinished: {$ne: true}}).exec()
    ctx.body = result
  })

  api.get('/todos/done', async(ctx) => {
    let result = await Todo.find({isFinished: true}).exec()
    ctx.body = result
  })

  api.post('/todo', async(ctx) => {
    let todo = new Todo(ctx.request.body)
    await todo.save()
    ctx.body = {
      status: true
    }
  })

  api.put('/todo/:id', async(ctx) => {
    console.log(ctx.request)
    console.log('body:', ctx.request.body)
    let body = ctx.request.body
    let id = ctx.params.id
    delete body.id
    let result = await Todo.updateOne({_id: id}, body)
    ctx.body = {
      status: true
    }
  })

  api.delete('/todo/:id', async(ctx) => {
    let body = ctx.request.body
    let id = ctx.params.id
    let result = await Todo.deleteOne({_id: id})
    ctx.body = {
      status: true
    }
  })
}
