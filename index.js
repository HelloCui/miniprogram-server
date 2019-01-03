const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const jsonp = require('koa-jsonp')
const path = require('path')
const fs = require('fs')
const https = require('https')
const bodyParser = require('koa-bodyparser')

const dbUrl = 'mongodb://localhost:27017/miniprogram';
const app = new Koa()
let api = new Router()

const mongoose = require('mongoose');

const Todo = require('./models/todo')

const staticPath = './static'

app.use(bodyParser())
app.use(jsonp())
app.use(static(
    path.join(__dirname, staticPath)
))

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = 'w(ﾟДﾟ)w' + '\n\n' + err.message
    ctx.app.emit('error', err, ctx)
  }
});

app.on('error', (err) => {
  console.error('server error', err)
});


api.get('/', async(ctx) => {
  ctx.body = '崔叔的个人网站'
})

api.get('/todos', async(ctx) => {
  let result = await Todo.find({}).exec()
  ctx.body = result
})

api.post('/todo', async(ctx) => {
  let todo = new Todo(ctx.request.body)
  await todo.save()
  ctx.body = {
    status: true
  }
})

api.put('/todo', async(ctx) => {
  let body = ctx.request.body
  let id = body.id
  if(!id) {
    throw({message: 'You don\'t have ID!'})
  }
  delete body.id
  let result = await Todo.updateOne({_id: id}, body)
  ctx.body = {
    status: true
  }
})

api.delete('/todo', async(ctx) => {
  let body = ctx.request.body
  let id = body.id
  if(!id) {
    throw({message: 'You don\'t have ID!'})
  }
  let result = await Todo.deleteOne({_id: id})
  ctx.body = {
    status: true
  }
})

app.use(api.routes()).use(api.allowedMethods())


async function runServer() {
  try {
    await mongoose.connect(dbUrl);
    await app.listen(80)
    const options = {
      key: fs.readFileSync('./ssl/private.key', 'utf8'),
      cert: fs.readFileSync('./ssl/20190103.pem', 'utf8')
    };
    https.createServer(options, app.callback()).listen(443)
    console.log('[miniprogram-server] is starting at port 80')
  } catch (e) {
    console.error(e)
  }
}

runServer()
