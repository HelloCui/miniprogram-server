let mongoose = require('mongoose')

let init = function() {
  mongoose.set('toJSON', {
    transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
  })
}

module.exports = init
