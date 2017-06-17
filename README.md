# Adidas Store API Wrapper #

The API wrapper serves to give API-like access to the Adidas store thus delegating browser emulation to this server rather than your scripts.

## Docs ##

### Searching ###

The search end-point is located at `/api/search/[query]`.

The `query` is a series of search terms that can be either divided by a `+` or just a space. The query will return the following object:

```
{
    items: [
        {
            link: "https://shop.adidas.ae/en/nmd-r1-shoes/BY9692.html",
            name: "NMD_R1 Shoes"
        },
        {
            link: "https://shop.adidas.ae/en/nmd-r1-shoes/BY9951.html",
            name: "NMD_R1 Shoes"
        },
    .....
    ],
    status: 1,
    length: 47,
    url: "https://shop.adidas.ae/en/search?q=Adidas+nmd",
    terms: [
        "good",
        "shoes"
    ]
}
```

### Product Details ###

The product details end-point located at `/api/info/[productUrl]` is typically necessary to add an item to cart as it returns the possible sizes.

>Note: `productUrl` must be safely url encoded

When queried with `/api/info/https%3A%2F%2Fshop.adidas.ae%2Fen%2Fnmd-r1-shoes%2FBY9951.html`, it will return the following object:

```
{
    category: "Shoes",
    color: "core black / core black / icey blue f17 (BY9951)",
    genders: [
        "Women"
    ],
    name: "NMD_R1 Shoes",
    priceAED: " 600",
    sizes: [
        "36",
        "36 2/3",
        "37 1/3",
        ......
    ],
    status: 1,
    link: "https://shop.adidas.ae/en/nmd-r1-shoes/BY9951.html"
}
```

>Note: Only available sizes are included. Out-of-stock ones are automatically rejected.

### Cart Operations ###

The cart end-point is located at `/api/cart/` and supports a number of operations documented below.

>Note: This end-point only supports shoes

#### Add to cart ###

To add an item to your cart, query the end point at `/api/cart/add/[productUrl]/[Size]` which will add it to the current users' cart.

Returned object is useless.