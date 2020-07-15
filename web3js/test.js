var Web3 = require('web3')

url = 'https://mainnet.infura.io/v3/375a84d45ba0456a8d39a32cce31471c'
var web3 = new Web3(url)

var address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'

web3.eth.getBalance( address, (err, bal) => {
    balance = bal
    balance = web3.utils.toHex(balance)

    console.log(balance)

    balance = web3.utils.fromWei( balance, 'ether' );

    console.log(balance)
} )


