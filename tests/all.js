const chai = require('chai')
chai.use(require('chai-fuzzy'))
const expect = chai.expect

const ParsePrices = require("../lib/parse-prices").ParsePrices;
const parsePrices = new ParsePrices();

describe('@datagica/parse-prices', () => {


  describe('English:', () => {

    it('should parse currencies', done => {
      const tests = [
        {
          input: "$2200",
          output: [
            { value: 2200, currency: 'USD' }
          ]
        }, {
          input: "$1300",
          output: [
            { value: 1300, currency: 'USD' }
          ]
        }, {
          input: "£4000",
          output: [
            { value: 4000, currency: 'GBP' }
          ]
        }, {
          input: "£5000",
          output: [
            { value: 5000, currency: 'GBP' }
          ]
        }
      ]

      Promise.all(tests.map(test => {
        return parsePrices.parse(test.input).then(output => {
          // console.log("output: " + JSON.stringify(output));
          expect(output).to.be.like(test.output)
          return Promise.resolve(true)
        })
      })).then(ended => {
        //console.log(`test ended`)
        done()
        return true
      }).catch(exc => {
        console.error(exc)
      })
    })

  })

})
