var request = require('request');

var searches = [
    {
        //Search term
        query: "NMD_R1 Shoes",
        //Size of shoe
        size: "40",
        //What nth item to take
        nth: 1
    },
    {
        query: "Campus shoes",
        size: "36",
        nth: 1
    },
    {
        query: "Campus shoes",
        size: "36",
        nth: 1
    },
    {
        query: "Campus shoes",
        size: "36",
        nth: 1
    },
    {
        query: "Campus shoes",
        size: "36",
        nth: 1
    }
]

searches.forEach((search) => {
    check(search)
})
function check(search){
if (search.found) {
    console.log("Already found")
    return
}
request('http://localhost:3000/api/search/' + encodeURIComponent(search.query), function (error, response, body) {
    var result = JSON.parse(body);

    if (result.length != 0) {
        console.log("Results for ", search.query)
        console.log("Adding to cart...")
        request('http://localhost:3000/api/cart/add/' + encodeURIComponent(result.items[search.nth].link) + "/" + encodeURIComponent(search.size), function (error, response, body) {
            console.log("Added to cart: https://shop.adidas.ae/en/checkout/onepage/")
        })
    } else {
        check(search)
    }

});
}