import Web3 from 'web3'
import _Tx from 'ethereumjs-tx'

const url = 'https://ropsten.infura.io/v3/375a84d45ba0456a8d39a32cce31471c'
const web3 = new Web3(new Web3.providers.HttpProvider(url));
const { Transaction : Tx } = _Tx

const from_address = "0x8524e72ff6a0a24b8c1c67ca74577ba5046b0183"
const to_address = "0x743376fd2a693723A60942D0b4B2F1765ea1Dbb0"

// build simple raw transactoin
const rawTransaction = {
    from: from_address,
    to: to_address,
    nonce: web3.utils.toHex(0),
    value: web3.utils.toHex(web3.utils.toWei('0.001', 'ether')),
    gasLimit: web3.utils.toHex(21000),
    gasPrice: web3.utils.toHex(1000000000),//50e9
};

var tx = new Tx(rawTransaction, { chain: 'ropsten', hardfork: 'petersburg' }, )

// r, s value from tss
const r = "69650308753487167192836966056962971656287853277336967408867791675286926163787"
const s = "42303693575951349260611200871303791782492522539662950695646327160725981135688"
const v = 42

// put r, s, v in raw transaction
tx.r = web3.utils.toHex(r)
tx.s = web3.utils.toHex(s)
tx.v = web3.utils.toHex(v)

const serializedTx = tx.serialize()

const raw = '0x' + serializedTx.toString('hex')
web3.eth.sendSignedTransaction( raw, (err, txHash) => {
    console.log('err:', err, 'txHash: ', txHash)
})

/*
//-----------------------------------------------------------------------------------------------//
// x is private key reconstruction from wi( wi = brikhoffcoefficient * share from alice library )
const x = "77ABB974B102656859B78584C31F4F8FD33861F2E1DE48AE9C2692B1E8B445CA"

tx.sign(Uint8Array.from(Buffer.from(x, 'hex')))

const serializedTx = tx.serialize()
const raw = '0x' + serializedTx.toString('hex')

web3.eth.sendSignedTransaction( raw, (err, txHash) => {
    console.log('err:', err, 'txHash: ', txHash)
})
*/