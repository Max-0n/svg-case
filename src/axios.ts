import axios from 'axios';

export default axios.create({
  baseURL: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/',
  headers: {
    'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
    'x-rapidapi-key': 'dafe0e5af1msh293700b616cf99cp19b59ejsn9c1d5261bfb2'
  }
});
