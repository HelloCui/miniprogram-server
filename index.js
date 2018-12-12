const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const jsonp = require('koa-jsonp')
const path = require('path')

const app = new Koa()
let api = new Router()

const staticPath = './static'

app.use(jsonp())
app.use(static(
    path.join(__dirname, staticPath)
))

api.get('/', async(ctx) => {
    ctx.body = '崔叔的个人网站'
})

app.use(api.routes()).use(api.allowedMethods())

app.listen(80, () => {
    console.log('[miniprogram-server] is starting at port 80')
})
