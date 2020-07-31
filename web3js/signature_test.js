import Web3 from 'web3'
import _Tx from 'ethereumjs-tx'
import keccak from 'js-sha3'
import secp256k1 from 'secp256k1'
//import rlphash from 'ethereumjs-util'
import util from 'ethereumjs-util'
//import * as SSS from './SSS.js'

const url = 'https://ropsten.infura.io/v3/375a84d45ba0456a8d39a32cce31471c'
const web3 = new Web3(new Web3.providers.HttpProvider(url));
const { Transaction : Tx } = _Tx
const{ keccak256 } = keccak
const{ ecsign } = util

//const from_address = "0x4f8d6be7dd4febdbf8ac3a7c582d5897c1422b32"
const from_address = "99f039bffe27d2a868f46c49a5889920f68eabfe"
const to_address = "0x743376fd2a693723A60942D0b4B2F1765ea1Dbb0"

const rawTransaction = {
    from: from_address,
    to: to_address,
    nonce: web3.utils.toHex(6),
    value: web3.utils.toHex(web3.utils.toWei('0.001', 'ether')),
    gasLimit: web3.utils.toHex(21000),
    gasPrice: web3.utils.toHex(50e9)
};

var tx = new Tx(rawTransaction, { chain: 'ropsten', hardfork: 'petersburg' }, )
console.log(tx.raw)
const msgHash = keccak256(util.rlphash(tx.raw))

const uintMsg = Uint8Array.from(Buffer.from(msgHash, 'hex'))        
const privateKey = Buffer.from("9718f5e8049711bdf4f4f2ca7dc98d3b6ddf9e4bfe4aaa2f5c97757380738928", "hex")

const Sig = ecsign(uintMsg, privateKey)
console.log(Sig)
//const backToHex = Buffer.from(Sig.signature).toString('hex')        
//console.log(backToHex)

