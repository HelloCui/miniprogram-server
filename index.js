const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const jsonp = require('koa-jsonp')
const path = require('path')
const fs = require('fs')
const https = require('https')
const bodyParser = require('koa-bodyparser')
//db
const mongoose = require('mongoose')
const modelsInit = require('./models/init')
const startSchedule = require('./startSchedule.js')
const dbUrl = 'mongodb://localhost:27017/miniprogram'
//routers
const userRouter = require('./routes/user')
const todoRouter = require('./routes/todo')
const checkTodayRouter = require('./routes/checkToday')
const remoteLogRouter = require('./routes/remoteLog')
const app = new Koa()
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

let routers = [userRouter, todoRouter, checkTodayRouter, remoteLogRouter]
routers.forEach(router => {
  app.use(router.routes(), router.allowedMethods())
})

async function runServer() {
  try {
    await mongoose.connect(dbUrl)
    startSchedule()
    await app.listen(80)
    const options = {
      key: fs.readFileSync('./ssl/https/private.key'),
      cert: fs.readFileSync('./ssl/https/public.pem')
    };
    await https.createServer(options, app.callback()).listen(443)
    modelsInit()
    console.log('[miniprogram-server] is starting at port 80')
  } catch (e) {
    console.error(e)
  }
}

runServer()
