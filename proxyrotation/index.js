var flat = require('node-flat-db')
var storage = require('node-flat-db/file-sync')
var db = flat('db.json', { storage: storage })

module.exports.randomProxy = function () {
  var proxies = db.object.proxies
  return proxies[Math.round((Math.random() * proxies.length))]
}

module.exports.getAllProxies = function () {
  return db.object.proxies
}

module.exports.addProxy = function (name, addr, port, user, pass) {
  db('proxies').push({
    name: name,
    addr: addr,
    port: port,
    user: user,
    pass: pass
  })
}

module.exports.deleteProxy = function (name) {
  db('proxies').remove({name: name})
}

// generate a random useragent
module.exports.genUseragent = function (name) {
  var userAgents = ['Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1', 'Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0', 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36', 'Mozilla/5.0 (compatible; MSIE 9.0; AOL 9.7; AOLBuild 4343.19; Windows NT 6.1; WOW64; Trident/5.0; FunWebProducts)', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A', 'Mozilla/5.0 (Windows; U; Windows NT 5.1; pt-BR) AppleWebKit/533.3 (KHTML, like Gecko) QtWeb Internet Browser/3.7 http://www.QtWeb.net', 'Mozilla/5.0 (Windows; U; Windows NT 6.1; x64; fr; rv:1.9.2.13) Gecko/20101203 Firebird/3.6.13']
  return userAgents[Math.round((Math.random() * userAgents.length))]
}
