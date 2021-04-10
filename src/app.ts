require('./style.scss');
import mainChart from './chart';

console.log('%cCreated by Max0n', 'color: #fff; font-weight: bold; background: #47c; padding:3px 5px;');
mainChart(document.getElementById('svg'), [
  { value: 10, price: 2265, name: 'Shares1', tag: 1 },
  { value: 100, price: 230, name: 'Shares2', tag: 1 },
  { value: 1100, price: 130, name: 'Shares3', tag: 1 },
  { value: 85, price: 235.25, name: 'Shares4', tag: 2 },
  { value: 60, price: 220.84, name: 'Shares5', tag: 2 },
  { value: 40, price: 377.77, name: 'Shares6', tag: 2 },
  { value: 50, price: 572.68, name: 'Shares7', tag: 2 },
  { value: 90, price: 187.22, name: 'Shares8' },
  { value: 40, price: 499.84, name: 'Shares9' },
  { value: 5, price: 3299.3, name: 'Shares10', tag: 3 },
  { value: 20, price: 554.58, name: 'Shares11', tag: 4 },
  { value: 80, price: 123.44, name: 'Shares12', tag: 4 },
  { value: 20, price: 683.8, name: 'Shares13' },
  { value: 20, price: 639, name: 'Shares14' },
]);

if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    // @ts-ignore
    console.info(window.performance.memory);
  }, 1000);
}
