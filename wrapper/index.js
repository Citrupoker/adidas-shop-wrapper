var Nightmare = require('nightmare')

function start (loginUrl, account) {
  var nightmare = require('../configNightmare')(Nightmare)

  console.log(loginUrl)
  console.log(account)

  nightmare
        .goto(loginUrl + '?' + Math.random())
        .wait(500)
        .insert('#email', account.email)
        .insert('#pass', account.pass)
        .click('button.button.button--lg.button--info.button--login')
        .wait(1000)
        .evaluate(function () {
          return document.title
        })
        .then((title) => {
          if (title === 'Customer Login') {
            return start(loginUrl, account)
          } else {
            return nightmare
          }
        })
        // maintain session after login
}

function addToCart (itemUrl, size, account, callback) {
  var loginUrl = 'https://shop.adidas.ae/en/customer/account/login/referer/'

  start(loginUrl, account).goto(itemUrl)
        .wait(200)
        .evaluate(function (size) {
          Array.prototype.slice.call(document.querySelectorAll('.js-size-value ')).filter((v) => v.textContent == size)[0].click()
          document.querySelector('.button--product-add.js-add-to-bag').click()
        }, size)
        .then(() => callback())
}

function itemInfo (itemUrl, callback) {
  var nightmare = require('../configNightmare')(Nightmare)
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
        }).end()
        .then(function (item) {
          item.link = itemUrl
          callback(item)
        })
}

function search (searchQuery, account, callback) {
  var loginUrl = 'https://shop.adidas.ae/en/customer/account/login/referer/'
  var searchUrl = 'https://shop.adidas.ae/en/search?q=' + searchQuery.split(' ').join('+')

  start(loginUrl, account).goto(searchUrl)
        .wait(150)
        .evaluate(function () {
          var items = Array.prototype.slice.call(document.querySelectorAll('#products-list .card__link.card__link--text')).map((item) => ({ name: item.title, link: item.href }))
          return items
        }).end()
        .then(function (items) {
          callback({
            items: items,
            status: 1,
            length: items.length,
            url: searchUrl,
            terms: searchQuery.split(' ')
          })
        })
}

module.exports = {
  addToCart: addToCart,
  itemInfo: itemInfo,
  search: search
}
