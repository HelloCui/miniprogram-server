function getNowDate() {
  let now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

module.exports = {
  getNowDate
}
