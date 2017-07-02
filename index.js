const express = require('express')
const app = express()
var wrapper = require('./wrapper')
var isBusy = false
var proxyrotation = require('./proxyrotation')
var accounts = require('./accounts')

app.use('/api/*', (req, res, next) => {
  console.log('Hit API end point')
  res.setHeader('Content-Type', 'application/json')
  next()
})

function throttler (req, res, next) {
  if (isBusy) {
    console.log('Busy.. waiting a couple of seconds')
    setTimeout(() => throttler(req, res, next), 250)
  } else {
    console.log('Not busy! Go!')
    isBusy = true
    next()
  }
}

app.post('/api/cart/add/:url/:size', throttler, function (req, res) {
  wrapper.addToCart(req.body.url, req.body.size, req.body.account, () => {
    res.json({ status: 1 })
    isBusy = false
  })
})

app.get('/api/info/:item', function (req, res) {
  wrapper.itemInfo(req.params.item, (info) => {
    res.json(info)
  })
})

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.sendFile(__dirname + '/README.md')
})

app.get('/api/search/:searchQuery', function (req, res) {
  wrapper.search(req.params.searchQuery, (results) => {
    res.json(results)
  })
})

app.post('/api/add/proxy', function (req, res) {
  var proxy = req.body.addr
  var port = req.body.port
  var name = req.body.name
  var user = req.body.user
  var pass = req.body.pass

  if (proxy && port && name && user && pass) {
    proxyrotation.addProxy(name, proxy, port, user, pass)
    return res.json({status: 1})
  }
  return res.json({status: 0})
})

app.get('/api/delete/proxy/:name', function (req, res) {
  var name = req.params.name
  if (name) {
    proxyrotation.deleteProxy(name)
    return res.json({status: 1})
  }
  return res.json({status: 0})
})

app.post('/api/add/account', function (req, res) {
  var name = req.body.name
  var email = req.body.email
  var pass = req.body.pass
  accounts.addAccount(name, email, pass)
})

app.get('/api/delete/account', function (req, res) {
  var name = req.body.name
  accounts.removeAccount(name)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
