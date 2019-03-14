const ERR_MSG = require('../error/errmsg')

module.exports = function(e, ctx) {
  if(ERR_MSG[e.message]) {
    ctx.body = {
      status: false,
      errcode: e.message,
      errmsg: ERR_MSG[e.message]
    }
  } else {
    throw e
  }
}
