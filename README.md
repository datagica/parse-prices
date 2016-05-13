# @datagica/parse-prices

Parse prices

The name of the module is plural to feel similar to other Datagica's APIs,
but for now only one price is returned (this is version 0.0.0 guys)

## Installation

    $ npm install --save @datagica/parse-prices

## Usage

```javascript
import parsePrices from "@datagica/parse-prices";

/* IMPORTANT: the API is promise-based, use it like this:
parsePrices("GameStation 5 will cost $499").then(result => {
  console.log(result)
  // will output:
  [
    { value: 499, currency: 'USD'
  ]
})
```

## TODO

- support more than one price
