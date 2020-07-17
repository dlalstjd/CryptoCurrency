import Web3 from 'web3'
import _Tx from 'ethereumjs-tx'

// using ropsten as endpoints
const url = 'https://ropsten.infura.io/v3/375a84d45ba0456a8d39a32cce31471c'
// connect to any peer; using infura here
const web3 = new Web3(new Web3.providers.HttpProvider(url));
const { Transaction : Tx } = _Tx

// send transaction
export function sendTx(fromAddress, toAddress, value, privateKey){
    web3.utils.toHex(web3.eth.getTransactionCount(fromAddress, (err, count) => {
        const accountNonce = web3.utils.toHex(count+1)
        //transaction object
        const rawTransaction = {
            from: fromAddress,
            to: toAddress,
            nonce: accountNonce,
            value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(50e9)
        };
  
        var tx = new Tx(rawTransaction, { chain: 'ropsten', hardfork: 'petersburg' }, )
        tx.sign(privateKey)

        const serializedTx = tx.serialize()
        const raw = '0x' + serializedTx.toString('hex')

        web3.eth.sendSignedTransaction( raw, (err, txHash) => {
            console.log('err:', err, 'txHash: ', txHash)
        })
    }))
}