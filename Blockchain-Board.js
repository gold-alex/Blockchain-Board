'use strict'

const axios = require("axios");
const Max7219 = require('.')
const controllerCount = 4
const m = new Max7219({ device: '/dev/spidev0.0', controllerCount, reversedDisplayOrdering: true, flip: 'both', rotate: 180})


async function init () {
  for (let i = 0; i < controllerCount; i++) {
    await m.reset(i)
  }
  let tezosprice; 
  let etherprice;
  let btcprice;

    try {
        //XTZ
        const xtzdata = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=usd&include_24hr_change=true`);
        tezosprice = xtzdata.data.tezos.usd;
        //ETH
        const etherdata = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true`);
        etherprice = etherdata.data.ethereum.usd;
        
        //BTC
        const btcdata = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true`);
        btcprice = btcdata.data.bitcoin.usd;

    } catch (err) {
        console.log("error");
    }


  await m.scroll(`GM wockchain.eth    BUY ETH    ETH: $${etherprice}    XTZ: $${tezosprice}    BTC: $${btcprice}`,{scrollIn: true, loop: false, speed: 30})
  await m.resetAll();
}

init()

//API Request Timer
setInterval(function () {
    init();
}, 21000); //milliseconds



