var Nightmare = require('nightmare')
var loginUrl = 'https://shop.adidas.ae/en/customer/account/login/referer/'

function login (loginUrl, account) {
  var nightmare = require('../configNightmare')(Nightmare)
  // maintain session after login

  nightmare.goto(loginUrl + '?' + Math.random())
        .wait(500)
        .insert('#email', account.email)
        .insert('#pass', account.pass)
        .click('button.button.button--lg.button--info.button--login')
        .wait(1000)
        .evaluate(function () {
          return document.title
        })
        .then((title) => {
          if (!title === 'Customer Login') {
            console.log('logged in')
          }
        })

  return nightmare
}

function addToCart (itemUrl, size, account, callback) {
  var loginUrl = 'https://shop.adidas.ae/en/customer/account/login/referer/'

  login(loginUrl, account).goto(itemUrl)
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
  var searchUrl = 'https://shop.adidas.ae/en/search?q=' + searchQuery.split(' ').join('+')

  login(loginUrl, account).goto(searchUrl)
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

function checkout(account, city, shipAddress, billAddress, phone, callback) {
  var loginUrl = 'https://shop.adidas.ae/en/customer/account/login/referer/'

  login(loginUrl, account).goto('https://shop.adidas.ae/en/checkout/onepage/')
        .wait('.button--checkout-submit')
        .insert('#shipping:street1', shipAddress)
        .insert('#billing:street1', billAddress)
        .insert('#shipping:telephone', phone)
        .insert('#billing:telephone', phone)
        .select('#shipping:country_id', 'AE')
        .select('#billing:country_id', 'AE')
        .select('#shipping:city_id', city)
        .select('#billing:city_id', city)
        .click('.button--checkout-submit')
        .wait(500)
        .click('#p_method_checkoutdotcom')
        .wait(100)
        .insert('#checkoutdotcom_cc_owner', account.credit.name)
        .select('#checkoutdotcom_cc_type', account.credit.type)
        .insert('#checkoutdotcom_cc_number', account.credit.number)
        .select('#checkoutdotcom_expiration', account.credit.expiration.month)
        .select('#checkoutdotcom_expiration_yr', account.credit.expiration.year)
        .insert('#checkoutdotcom_cc_cid', account.credit.cvv)
        .evaluate(function () {
          document.querySelectorAll('.button--checkout-submit')[1].click()
        })
        .then(() => callback())
}

module.exports = {
  addToCart: addToCart,
  itemInfo: itemInfo,
  search: search,
  checkout: checkout
}
