import Web3 from 'web3'
import _Tx from 'ethereumjs-tx'
import keccak from 'js-sha3'
//import secp256k1 from 'secp256k1'
import pkg from 'ethereumjs-wallet'
//import txDecoder from 'ethereum-tx-decoder'
import util from 'ethereumjs-util'

const url = 'https://ropsten.infura.io/v3/375a84d45ba0456a8d39a32cce31471c'
const web3 = new Web3(new Web3.providers.HttpProvider(url));
const { Transaction : Tx } = _Tx
const{ keccak256 } = keccak
const { default : Wallet } = pkg

/*
const x_coordinate = web3.utils.toHex("85556674236879568521519464397895875853009790432415548013957742860428482257814").slice(2, )
//console.log(web3.utils.toHex(x_coordinate))

const y_coordinate = web3.utils.toHex("30994920491134501242484194368073251458639356656492191736687915449103623375987").slice(2, )
//console.log(web3.utils.toHex(y_coordinate))

const xpub = "xpub" + x_coordinate + y_coordinate
console.log(xpub)
const pub = Wallet.fromExtendedPublicKey(xpub)
console.log(pub)
*/
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

//const msg =  [101, 76, 2, 206, 14, 133, 132, 177, 17, 12, 19, 100, 189, 78, 153, 159, 62, 37, 106, 6, 191, 114, 151, 81, 10, 110, 208, 163, 0, 39, 217, 27]
//const hex = Uint8Array.from(Buffer.from(msg).toString('hex'))
//const hex = Uint8Array.from(msg)

var tx = new Tx(rawTransaction, { chain: 'ropsten', hardfork: 'petersburg' }, )

const r = "29860421401746323085666773732583269052286762170227307798122711355561284363296"
const s = "25398801185773830584947880320881540957958746367752501504457184409022103774550"
const v = 42

tx.r = web3.utils.toHex(r)
tx.s = web3.utils.toHex(s)
tx.v = web3.utils.toHex(v)

// console.log(tx)
//console.log(tx.getSenderPublicKey())
console.log(tx.getSenderAddress())

const serializedTx = tx.serialize()
// console.log(serializedTx)

const raw = '0x' + serializedTx.toString('hex')
//console.log(raw);

//console.log(txDecoder.decodeTx(raw))

web3.eth.sendSignedTransaction( raw, (err, txHash) => {
    console.log('err:', err, 'txHash: ', txHash)
})

