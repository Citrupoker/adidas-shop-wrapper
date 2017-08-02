var flat = require('node-flat-db')
var storage = require('node-flat-db/file-sync')
var db = flat('db.json', { storage: storage })

module.exports.addAccount = function (name, email, pass, credit) {
  db('accounts').push({name: name, email: email, pass: pass, credit: credit})
}

module.exports.removeAccount = function (name) {
  db('accounts').remove({name: name})
}

module.exports.getAccount = function (name) {
  return db('accounts').find({name: name})
}

module.exports.allAccounts = function () {
  return db.object.accounts
}
