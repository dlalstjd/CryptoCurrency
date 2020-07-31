import Web3 from 'web3'
import _Tx from 'ethereumjs-tx'
import keccak from 'js-sha3'
import secp256k1 from 'secp256k1'
//import rlphash from 'ethereumjs-util'
import util from 'ethereumjs-util'
import txDecoder from 'ethereum-tx-decoder'
//var txDecoder = require('ethereum-tx-decoder');

//import * as SSS from './SSS.js'

const url = 'https://ropsten.infura.io/v3/375a84d45ba0456a8d39a32cce31471c'
const web3 = new Web3(new Web3.providers.HttpProvider(url));
const { Transaction : Tx } = _Tx
const{ keccak256 } = keccak
const{ ecsign } = util

//const from_address = "0x4f8d6be7dd4febdbf8ac3a7c582d5897c1422b32"
const from_address = "0x99f039bffe27d2a868f46c49a5889920f68eabfe"
const to_address = "0x743376fd2a693723A60942D0b4B2F1765ea1Dbb0"

const rawTransaction = {
    from: from_address,
    to: to_address,
    nonce: web3.utils.toHex(0),
    value: web3.utils.toHex(web3.utils.toWei('0.001', 'ether')),
    gasLimit: web3.utils.toHex(21000),
    gasPrice: web3.utils.toHex(50e9),
};

const msg = [249,85,74,2,162,31,189,136,48,112,14,229,173,106,49,161,235,40,95,214,70,29,254,155,217,50,65,137,44,197,205,44]
const hex = Buffer.from(msg).toString('hex')
console.log(hex)

var tx = new Tx(rawTransaction, { chain: 'ropsten', hardfork: 'petersburg' }, )

const r = "85154094909487471260476513072605173124555759920348708084928921321576147112055"
const s = "36174566012658177741771168398925546663644885796058154329750432761580780913620"

tx.r = web3.utils.toHex(r)
tx.s = web3.utils.toHex(s)
tx.v = web3.utils.toHex(27)

// console.log(tx)

const serializedTx = tx.serialize()
// console.log(serializedTx)

const raw = '0x' + serializedTx.toString('hex')
console.log(raw);

console.log(txDecoder.decodeTx(raw))

//web3.eth.sendSignedTransaction( raw, (err, txHash) => {
//    console.log('err:', err, 'txHash: ', txHash)
//})

