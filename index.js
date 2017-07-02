const express = require('express')
const app = express()
var wrapper = require('./wrapper')
var isBusy = false


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



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
