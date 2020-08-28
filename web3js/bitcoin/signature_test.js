import * as generator from './KeyGenerator.js'
import * as tx from './SendTx.js'
import bitcoin from 'bitcoinjs-lib'
import Web3 from 'web3'
const testnet = bitcoin.networks.testnet
const web3 = new Web3()

const privateKey = Buffer.from("DCDB54465BC08AD4E03242999D6E61C9A4CF216F9E70C23E4262866E85E209B7", 'hex')
const publicKey = generator.derivePublicKey(privateKey)
const address = generator.deriveAddress(publicKey)
//console.log(address) - mhP4iFS4jyLRrgjX6qbVQHCoe4H3aZkcb8

const prevTx = "02000000000101b6f47bc9bf94f98f2b5928ab1682a264efea45a2d4f18466b8262fdfeb15d5ff010000001716001473410f22f1e091e05276ef4ac7fcf4fe20632185feffffff02513a1100000000001976a914147247d8ea66b946661dc47418ec03ec0ab9829588ac49e62e3f0100000017a91418501678ba9ba786dcb063df61ae2647d9f0a9668702473044022065c1e2b543cb7ab09337b4ad3033df872ee9946c1546786083e73c22fac82bb0022050fdfad86ab0acafb67a8e14fc805538ea34ff84392a025debc23c0d95b1031e012103ff3e7ac23d7113c18373e9b8f2549c64ea3961359270c99c1480b6c7cdba575aab971b00"
const amount = 	1120000
const minerfee = 20000
const toAddress = "mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB"  // send back address mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB

/*
//msg: 18c4fa3fa140797e2b4047c03628009273e497e09b2874221e20d27cca9e1609
//r: "71266443417005326348767284092020604920373252545233994831518495093345162990173"
//s: "46569784040597525448551794389602402020011666348683766866835450591142342846603"

//46f28750cfdfca9c4773506aec913a4ed8942290c71f6d0214f19c0a7691f353
//d9cfd5628608de87ed1d934bbe7efcdcae06d6f3a01190babb91d4a38a732ec4

const r = web3.utils.toHex("71266443417005326348767284092020604920373252545233994831518495093345162990173").substring(2)
const s = web3.utils.toHex("46569784040597525448551794389602402020011666348683766866835450591142342846603").substring(2)
console.log(r)
console.log(s)
*/
tx.createTransaction(prevTx, privateKey, amount, minerfee, toAddress, 0)