const Caver = require('caver-js');
const caver = new Caver('https://api.baobab.klaytn.net:8651/');

async function getSingleKeyring(){
    const privateKey = '0x' +process.argv[2];
    const keyringFromPrivateKey = caver.wallet.keyring.createFromPrivateKey(privateKey);
    console.log(keyringFromPrivateKey.address);
}

getSingleKeyring();