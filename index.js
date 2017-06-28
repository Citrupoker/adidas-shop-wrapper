const express = require('express')
const app = express()

var isBusy = false

var Nightmare = require('nightmare')
var nightmare = Nightmare({ show: true })
var loginUrl = 'https://shop.adidas.ae/en/customer/account/login/referer/'

start()
function start () {
  nightmare
        .goto(loginUrl + '?' + Math.random())
        .wait(500)
        .insert('#email', 'evansantonio32@gmail.com')
        .insert('#pass', 'adidas.3u')
        .click('button.button.button--lg.button--info.button--login')
        .wait(1000)
        .evaluate(function () {
          return document.title
        })
        .then((title) => {
          if (title == 'Customer Login') {
              start()
            } else {
              app.listen(3000, function () {
                  console.log('Example app listening on port 3000!')
                })
            }
        })
}
app.use('/api/*', (req, res, next) => {
  console.log('Hit API end point')
  res.setHeader('Content-Type', 'application/json')
    //throttler(req, res, next)
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

app.get('/api/cart/add/:url/:size', throttler, function (req, res) {
  addToCart(req.params.url, req.params.size, () => {
      res.json({ status: 1 })
      isBusy = false
    })
})

app.get('/api/info/:item', function (req, res) {
  itemInfo(req.params.item, (info) => {
      res.json(info)
        // isBusy = false;
    })
})

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
    res.sendFile(__dirname + '/README.md')
})

app.get('/api/search/:searchQuery', function (req, res) {
  search(req.params.searchQuery, (results) => {
      res.json(results)
        //isBusy = false;
    })
})

function addToCart (itemUrl, size, callback) {
  console.log(loginUrl)
  nightmare
        .goto(itemUrl)
        .wait(200)
        .evaluate(function (size) {
            Array.prototype.slice.call(document.querySelectorAll(".js-size-value ")).filter((v) => v.textContent == size)[0].click()
            document.querySelector(".button--product-add.js-add-to-bag").click()
            alert(size);
            
        }, size)
        .then(() => callback())
}

function itemInfo (itemUrl, callback) {
  var Nightmare = require('nightmare')
    var nightmare = Nightmare({ show: false })

    nightmare
        .goto(itemUrl)
        .wait(100)
        .evaluate(function () {
          var item = {
              color: document.querySelector('.product__color').textContent.trim().replace('Color ', ''),
              sizes: Array.prototype.slice.call(document.querySelectorAll('.product-size .js-size-value')).filter((size) => !size.className.includes('disabled')).map((size) => (size.textContent)),
              priceAED: document.querySelector('.price').textContent.replace('AED', ''),
              genders: Array.prototype.slice.call(document.querySelectorAll('.gender a')).map((gender) => gender.textContent),
              name: document.querySelector('.product__name.product__name--big-screen h1').textContent,
              category: document.querySelector('.division a').textContent,
              status: 1
            }
          return item
            //return document.querySelectorAll(".table-of-contents__title a")
        }).end()
        .then(function (item) {
            // console.log(JSON.stringify(courses));

          item.link = itemUrl
            callback(item)

            /* var tasks = courses.map((course, index) => (
                 (callback) => {
                     scrape(course, index, callback)
                 }
             ))
             require("async.parallellimit")(tasks, 1, function () {}); */
        })
}

function search (searchQuery, callback) {
  var Nightmare = require('nightmare')
    var nightmare = Nightmare({ show: false })

    var searchUrl = 'https://shop.adidas.ae/en/search?q=' + searchQuery.split(' ').join('+')

  nightmare
        .goto(searchUrl)
        .wait(150)
        .evaluate(function () {
          var items = Array.prototype.slice.call(document.querySelectorAll('#products-list .card__link.card__link--text')).map((item) => ({ name: item.title, link: item.href }))
          return items
            //return document.querySelectorAll(".table-of-contents__title a")
        }).end()
        .then(function (items) {
            // console.log(JSON.stringify(courses));

          callback({
              items: items,
              status: 1,
              length: items.length,
              url: searchUrl,
              terms: searchQuery.split(' ')
            })
        })
}
