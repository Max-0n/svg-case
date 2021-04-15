require('./style.scss');
import mainChart from './chart';
import axios from './axios';

console.log('%cCreated by Max0n', 'color: #fff; font-weight: bold; background: #47c; padding:3px 5px;');

setUp();

let stocks = JSON.parse(localStorage.getItem('stocks')) || {};

mainChart(document.getElementById('svg'), stocks);

// if (process.env.NODE_ENV === 'development') {
//   setInterval(() => {
//     // @ts-ignore
//     console.info(window.performance.memory);
//   }, 5000);
// }

document.getElementById('menu').onclick = () => {
  let stocks = localStorage.getItem('stocks');
  stocks = stocks ? JSON.parse(stocks) : {};

  const symbol = prompt('Set SYMBOL ("TSLA", "AAPL" or another...):');
  if (symbol) {
    axios.get('market/v2/get-quotes', {
        params: { region: 'US', symbols: symbol, lang: 'en' }
      })
      .then(({ data: { quoteResponse: { error, result } } }) => {
        if (error) throw new Error(error);
        else {
          const quantity = prompt('Set quantity of stocks');

          for (let item of result) {
            stocks[`${item.symbol}`] = {
              value: +quantity,
              price: item.regularMarketPrice,
              symbol: item.symbol
            }
          }

          localStorage.setItem('stocks', JSON.stringify(stocks));
          mainChart(document.getElementById('svg'), stocks);
        }
        // handle success
      })
      .catch(error => console.info('get-quotes request fail', error));
  } else {
    alert('Not valid');
  }
};

function setUp() {
  let stocks = localStorage.getItem('stocks');
  stocks = stocks ? JSON.parse(stocks) : {};
  // INFO: Docs – https://rapidapi.com/apidojo/api/yahoo-finance1
  axios.get('market/v2/get-quotes', {
      params: {
        region: 'US',
        symbols: Object.keys(JSON.parse(localStorage.getItem('stocks'))).join(','),
        lang: 'en'
      }
    })
    .then(({ data: { quoteResponse: { error, result } } }) => {
      if (error) throw new Error(error);
      else {
        for (let item of result) {
          // console.log('item.symbol', item.symbol, stocks[`${item.symbol}`]);
          stocks[`${item.symbol}`] = {
            value: stocks[`${item.symbol}`].value || 0,
            price: item.regularMarketPrice,
            symbol: item.symbol
          }
        }
        localStorage.setItem('stocks', JSON.stringify(stocks));
      }
    })
    .catch(error => console.info('get-quotes request fail', error));
}
