var flat = require('node-flat-db')
var storage = require('node-flat-db/file-sync')
var db = flat('db.json', { storage: storage })

module.exports.getProxy = function () {
  var proxies = db.object.proxies
  return proxies[Math.round((Math.random() * proxies.length))]
}

module.exports.addProxy = function (name, ip, port, user, pass) {
  db('proxies').push({
    name: name,
    ip: ip,
    port: port,
    user: user,
    pass: pass
  })
}

module.exports.deleteProxy = function (name) {
  db('proxies').remove({name: name})
}
