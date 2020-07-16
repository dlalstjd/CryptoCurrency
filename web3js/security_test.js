import * as generator from "./generateAddress.js"
import Web3 from 'web3'
import _Tx from 'ethereumjs-tx'

//console.log(Web3)

// using ropsten as endpoints
var url = 'https://ropsten.infura.io/v3/375a84d45ba0456a8d39a32cce31471c'
// connect to any peer; using infura here
const web3 = new Web3(new Web3.providers.HttpProvider(url));

const mnemonic = generator.generateMnemonic()
const privateKey = generator.generatePrivateKey(mnemonic)
//console.log( "generateAddress.js pirvate key result: " + privateKey )

const publicKey = web3.utils.toHex( generator.derivePublicKey(privateKey) ).toString()
const address = web3.utils.toHex( generator.deriveAddress(publicKey) ).toString()
//console.log( "deriveed address from keccak256 and public key from above private key: "+ address )


const account = web3.eth.accounts.privateKeyToAccount(web3.utils.toHex(privateKey).toString())

//const Wallet = web3.eth.accounts.wallet.create();
//Wallet.add(account)
//console.log(Wallet)

//console.log(_Tx)
const { Transaction : Tx } = _Tx

const rawTransaction = {
    from: "0x4f8D6BE7DD4FebDbf8AC3a7c582d5897C1422B32",
    to: "0x743376fd2a693723A60942D0b4B2F1765ea1Dbb0",
    //value: web3.utils.toHex(web3.utils.toWei("0.01"))
    value: '0x2386f26fc1000',
    gas: web3.utils.toHex(web3.utils.toWei("10", "Kwei")),
    // "chainId": 8888
  };

var tx = new Tx(rawTransaction, { chain: 'ropsten', hardfork: 'petersburg' })
tx.sign(privateKey)

const serializedTx = tx.serialize()
const raw = '0x' + serializedTx.toString('hex')

web3.eth.sendSignedTransaction( raw, (err, txHash) => {
    console.log('err:', err, 'txHash: ', txHash)
})

