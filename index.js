
const startService = require('./service');

const URL = "http://swap.defillama.com/";
const CHAIN = "Arbitrum One";
const S_QTY = '12';
const S_TOKEN = 'Wrapped BTC (WBTC)';
const B_TOKEN = "USD Coin (USDC)";
const INDEX = '2';
startService({URL,CHAIN,S_QTY,S_TOKEN,B_TOKEN,INDEX});