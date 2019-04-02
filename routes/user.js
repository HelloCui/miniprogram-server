const Router = require('koa-router')
const fs = require('fs')
const jwt = require('jsonwebtoken')
jsSHA = require('jssha')
const User = require('../models/user')
const ERR_MSG = require('../error/errmsg')
const handleResErr = require('../error/handleResErr')

const router = new Router()
const privateKey = fs.readFileSync('./ssl/jwt/private.pem')
const publicKey = fs.readFileSync('./ssl/jwt/public.pem')
const permitRoute = ['canRegister', 'register', 'login', 'token']

router.all(/.*/, async(ctx, next) => {
  try {
    let url = ctx.url.split('?')[0].split('/')[1]
    if(permitRoute.indexOf(url) >= 0){
      await next()
    } else {
      let decoded;
      let token = getTokenFromHeader(ctx)
      if(token) {
        decoded = verifyToken(token)
      }
      if(!decoded) {
        throw new Error('LIMITED_ACCESS')
      } else {
        ctx.passUser = decoded
        await next()
      }
    }
  } catch (e) {
    if(e.message == 'LIMITED_ACCESS') {
      ctx.body = {
        status: false,
        errcode: e.message,
        errmsg: ERR_MSG[e.message]
      }
      ctx.status = 401
    } else {
      ctx.body = {
        errmsg: e.message
      }
      ctx.status = 500
      console.error(e)
    }
  }
})
router.get('/canRegister/:name', async(ctx) => {
  let result = await canRegister(ctx.params.name)
  ctx.body = {
    status: true,
    canRegister: result
  }
})
router.post('/register', async(ctx) => {
  try {
    let body = ctx.request.body
    if(!body.name || !body.password) {
      throw('必须包含用户名和密码')
    }
    let canRe = await canRegister(body.name)
    if(!canRe) {
      throw('EXISTED_USER')
    }
    let user = new User({
      name: body.name,
      password: hash(body.password),
      refreshToken: generateRefreshToken()
    })
    await user.save()
    ctx.body = {
      status: true,
      token: generateToken({
        uid: user._id
      }),
      refreshToken: user.refreshToken
    }
  } catch (e) {
    handleResErr(e, ctx)
  }
})
router.post('/login', async(ctx) => {
  try {
    let body = ctx.request.body
    let name = body.name
    let password = hash(body.password)
    let user = await User.findOne({name}).exec()
    if(!user) {
      throw new Error('NO_USER')
    }
    if(user.password != password) {
      throw new Error('WRONG_PASSWORD')
    }
    user.refreshToken = generateRefreshToken()
    await user.save()
    ctx.body = {
      status: true,
      token: generateToken({
        uid: user._id
      }),
      refreshToken: user.refreshToken
    }
  } catch (e) {
    handleResErr(e, ctx)
  }
})
router.get('/token', async(ctx) => {
  let refreshToken = ctx.query.refreshToken
  let token = ctx.query.token
  if(!refreshToken || !token) {
    throw new Error('LIMITED_ACCESS')
  }
  decoded = jwt.verify(token, publicKey, {ignoreExpiration: true})
  if(!decoded.uid) {
    throw new Error('LIMITED_ACCESS')
  }
  let user = await User.findOne({_id: decoded.uid}).exec()
  if(!user || user.refreshToken != refreshToken) {
    throw new Error('LIMITED_ACCESS')
  }
  user.refreshToken = generateRefreshToken()
  await user.save();
  ctx.body = {
    status: true,
    token: generateToken(decoded),
    refreshToken: user.refreshToken
  }
})

async function canRegister(name){
  let user = await User.findOne({name: name}).exec()
  return !user
}

function generateToken(payload) {
  payload.exp = Math.floor(Date.now() / 1000) + 1 * 60
  return jwt.sign(payload, privateKey, {algorithm: 'RS256'})
}

function generateRefreshToken() {
  return [...Array(16)].map(() => Math.random().toString(36)[3]).join('')
}

function getTokenFromHeader(ctx) {
  return ctx.header.token || ''
}

function verifyToken(token) {
  try {
    var decoded = jwt.verify(token, publicKey);
    return decoded
  } catch(err) {
    console.error(err)
    return false
  }
}

function hash(str) {
  var shaObj = new jsSHA('SHA-512', 'TEXT');
  shaObj.update(str);
  return shaObj.getHash('HEX');
}

module.exports = router
