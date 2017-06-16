const express = require('express')
const app = express()

app.get('/addToCart', function (req, res) {
  res.send('Hello World!')
})

app.get('/info/:item', function (req, res) {
  itemInfo(req.params.item, (info)=>res.send(info));
})

app.get('/search/:searchQuery', function (req, res) {
    search(req.params.searchQuery, (results)=>{
        res.send(results);
    })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

function itemInfo(itemUrl, callback) {
    var Nightmare = require('nightmare');
    var nightmare = Nightmare({ show: false });

    nightmare
        .goto(itemUrl)
        .wait(1000)
        .evaluate(function () {
            var item = {
                color: document.querySelector(".product__color").textContent.trim().replace("Color ", ""),
                sizes: Array.prototype.slice.call(document.querySelectorAll(".product-size .js-size-value")).map((size)=>(size.textContent)),
                priceAED: document.querySelector(".price").textContent.replace("AED", ""),
                genders: Array.prototype.slice.call(document.querySelectorAll(".gender a")).map((gender)=>gender.textContent),
                name: document.querySelector(".product__name.product__name--big-screen h1").textContent,
                category: document.querySelector(".division a").textContent
            }
            return item;
            //return document.querySelectorAll(".table-of-contents__title a")
        })
        .then(function (item) {
            //console.log(JSON.stringify(courses));


            callback(item)

            /* var tasks = courses.map((course, index) => (
                 (callback) => {
                     scrape(course, index, callback)
                 }
             ))
             require("async.parallellimit")(tasks, 1, function () {});*/
        })

}

function search(query, callback) {
    var Nightmare = require('nightmare');
    var nightmare = Nightmare({ show: false });

    var searchQuery = "Adidas nmd";

    var searchUrl = "https://shop.adidas.ae/en/search?q=" + searchQuery.split(" ").join("+")

    nightmare
        .goto(searchUrl)
        .wait(1000)
        .evaluate(function () {
            var items = Array.prototype.slice.call(document.querySelectorAll("#products-list .card__link.card__link--text")).map((item) => ({ name: item.title, link: item.href }))
            return items;
            //return document.querySelectorAll(".table-of-contents__title a")
        })
        .then(function (items) {
            //console.log(JSON.stringify(courses));


            callback({
                items: items,
                status: 1,
                length: items.length,
                url: searchUrl,
                terms: query.split(" ")
            })

            /* var tasks = courses.map((course, index) => (
                 (callback) => {
                     scrape(course, index, callback)
                 }
             ))
             require("async.parallellimit")(tasks, 1, function () {});*/
        })

}

/*function scrape(course, index, callback) {
    nightmare.goto(course.url)
        .wait("video")
        .wait(1000)
        .evaluate(() => {
            var src = document.querySelector("video").src
            return src
        }).then((result) => {
            //console.log(result)

            if (!result) {
                scrape(...arguments)
                return
            }

            course.src = result
            saveVideo(course, index + 1)
            callback()
        })
}

function saveVideo(course, number) {
    console.log(number);
    if (!fs.existsSync("videos/")) {
        fs.mkdirSync("videos/");
    }
    if (!fs.existsSync("videos/" + saveTo)) {
        fs.mkdirSync("videos/" + saveTo);
    }
    if (fs.existsSync("videos/" + saveTo + "/" + number + ". " + course.name.replace("/", "") + ".webm")) {
        return;
    }
    var file = fs.createWriteStream("videos/" + saveTo + "/" + number + ". " + course.name.replace("/", "") + ".webm");
    var request = http.get(course.src, function (response) {
        response.pipe(file);
    });
}*/