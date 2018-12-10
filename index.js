const Koa = require('koa')
const Router = require('koa-router')
const jsonp = require('koa-jsonp')

const app = new Koa()
let api = new Router()

app.use(jsonp())

api.get('/', async(ctx) => {
    ctx.body = '崔叔的个人网站'
})

app.use(api.routes()).use(api.allowedMethods())

app.listen(80, () => {
    console.log('[miniprogram-server] is starting at port 80')
})
