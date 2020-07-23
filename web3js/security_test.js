import * as generator from "./generateAddress.js"
import * as sender from "./sendTx.js"
import Web3 from 'web3'
import _Tx from 'ethereumjs-tx'
import * as SSS from './SSS.js'

//console.log(Web3)

// using ropsten as endpoints
const url = 'https://ropsten.infura.io/v3/375a84d45ba0456a8d39a32cce31471c'
// connect to any peer; using infura here
const web3 = new Web3(new Web3.providers.HttpProvider(url));

const mnemonic = generator.generateMnemonic()
const privateKey = generator.generatePrivateKey(mnemonic)

const n = 10
const m = 4
const shares = SSS.split_secret(privateKey, n, m)
//console.log( "generateAddress.js pirvate key result: " + privateKey )

//const publicKey = web3.utils.toHex( generator.derivePublicKey(privateKey) ).toString()
const publicKey = generator.derivePublicKey(privateKey)
//const address = web3.utils.toHex( generator.deriveAddress(publicKey) ).toString()
const address = generator.deriveAddress(publicKey)
//console.log( "deriveed address from keccak256 and public key from above private key: "+ address )
//const account = web3.eth.accounts.privateKeyToAccount(web3.utils.toHex(privateKey).toString())

const reconstructed = SSS.reconstruct_secret( SSS.generateRandomShare(shares, n), m )

if( reconstructed !== ""){
  sender.sendTx(address, "0x743376fd2a693723A60942D0b4B2F1765ea1Dbb0", '0.001', reconstructed)
}

