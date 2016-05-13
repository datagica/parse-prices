'use strict';

class ParsePrices {

  constructor() {

    const currencySymbolLeft = `(?:\\$|£|¥|JPY|BRL|USD|R\\$)`;
    const currencySymbolRight = `(?:円|€|CNY|EUR|₽|RUB|MXN|Mex\\$)`;
    const numericValue = `[1-9][0-9]{0,3}(?:(?:\\.|,| )[0-9]{0,3})?`;
    const currencyFactor = `(?:K|k|M|m|万)`;
    const separator = `(?:	|\\s|①|②|:){0,3}`;

    const amountLeft =
      currencySymbolLeft +
      `\\s?` +
      numericValue +
      `\\s?` +
      currencyFactor + `?`;

    const amountRight =
      numericValue +
      `\\s?` +
      currencyFactor + `?` +
      `\\s?` +
      currencySymbolRight;

    const amount = `(${amountLeft}|${amountRight})`
    //console.log("amount: "+amount)

    // extract the currency and the numeric value
    this.currency = new RegExp(
      `(?:` +
        `(\\$|USD)|` +
        `(£|GBP)|` +
        `(€|EUR)|` +
        `(CNY)|` +
        `(円|¥|JPY)|` +
        `(₽|RUB)|` +
        `(Mex\\$|MXN)|` +
        `(BRL|R\\$)` +
      `)`, "i");

    this.value = new RegExp(
      `(${numericValue})${separator}(K|M|万)?`,
      "i");
    //console.log(this.value)
  }


  parseFloatValue(str) {
    return parseFloat(`${str}`.replace(/[, ]/g, '.'));
  }

  parseCurrency(amount, locale) {
    // console.log(`parseCurrency(${amount}, ${locale})`)
    let match, currency;
    while ((match = this.currency.exec(amount)) !== null) {
      if (typeof match[1] === "string") { currency = "USD"; break; }
      if (typeof match[2] === "string") { currency = "GBP"; break; }
      if (typeof match[3] === "string") { currency = "EUR"; break; }
      if (typeof match[4] === "string") { currency = "CNY"; break; }
      if (typeof match[5] === "string") { currency = "JPY"; break; }
      if (typeof match[6] === "string") { currency = "RUB"; break; }
      if (typeof match[7] === "string") { currency = "MXN"; break; }
      if (typeof match[8] === "string") { currency = "BRL"; break; }
    }
    if (currency) return currency;
    if (typeof locale === "en") return "USD";
    if (typeof locale === "fr") return "EUR";
    if (typeof locale === "jp") return "JPY";
    return "USD";
  }
  parseValue(amount, locale, currency, isMonthly) {
    //console.log(`parseValue(${amount}, ${locale}, ${currency})`)
    const match = this.value.exec(amount);
    //console.log(match)
    if (match === null) return 0;

    const strValue = (typeof match[1] === "string") ? match[1] : "";
    const strFactor = ((typeof match[2] === "string") ? match[2] : "").toLowerCase();

    const value = this.parseFloatValue(strValue);

    if (!isNaN(value) && isFinite(value) && value > 0) {

      /*if (currency === "JPY" || currency === "RUB") {
        return value * 1000;
      } else {
        return value;
      }
      */
      if (strFactor.length){
        if (strFactor === "k") {
          return value * 1000;
        } else if (strFactor === "m") {
          return value * 1000 * 1000;
        } else if (strFactor === "万") {
          return value * 10 * 1000;
        } else {
          return value;
        }
      } else {
        return value;
      }
    } else {
      return 0;
    }
  }

  parse(input) {

    let text = ""
    if (typeof input === 'string') {
      text = input
    } else if (typeof input.text === 'string') {
      text = input.text
    } else {
      return Promise.reject(new Error(`input is not text but ${typeof input}`))
    }

    text = ` ${text} `;
    const currency = this.parseCurrency(text, 'en');
    const value = this.parseValue(text, 'en', currency);
    // yeah for now, only one price is returned (version 0.0.0 FTW)
    return Promise.resolve([{
      value: value,
      currency: currency
    }])
  }
}


const singletonInstance = new ParsePrices()
const singletonMethod = function() {
  return singletonInstance.parse.apply(singletonInstance, arguments);
}

module.exports = singletonMethod
module.exports.default = singletonMethod
module.exports.parsePrices = singletonInstance
module.exports.ParsePrices = ParsePrices
