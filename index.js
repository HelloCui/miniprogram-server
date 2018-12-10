const Koa = require('koa')
const Router = require('koa-router')
const jsonp = require('koa-jsonp')

const app = new Koa()
let api = new Router()

app.use(jsonp())

api.get('/', async(ctx) => {
    ctx.body = {
        status: true,
        data: {
            name: 'Tree',
            sex: 'M'
        }
    }
})

app.use(api.routes()).use(api.allowedMethods())

app.listen(3000, () => {
    console.log('[miniprogram-server] is starting at port 3000')
})
