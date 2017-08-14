var flat = require('node-flat-db')
var storage = require('node-flat-db/file-sync')
var db = flat('db.json', { storage: storage })
var jsonQuery = require('json-query')

module.exports.addAccount = function (name, email, pass) {
  if (jsonQuery(`[name=${name}]`, {data: db.object.accounts}).value == null) {
    db('accounts').push({name: name, email: email, pass: pass})
  }
}

module.exports.removeAccount = function (name) {
  db('accounts').remove({name: name})
}

module.exports.removeAllAccounts = function (name) {
  db('accounts').remove({})
}

module.exports.getAccount = function (name) {
  return jsonQuery(`[name=${name}]`, {data: db.object.accounts}).value
}

module.exports.allAccounts = function () {
  return db.object.accounts
}
