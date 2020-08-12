import bitcore from 'bitcore-lib'
import bitcore_insight from 'bitcore-insight'
import * as generator from './KeyGenerator.js'
const { Insight } = bitcore_insight

let insight = new Insight('testnet')

const ADDRESSTO = "moCEHE5fJgb6yHtF9eLNnS52UQVUkHjnNm"
const AMOUNT = 50000
const FEE = 50000

const mnemonic = generator.generateMnemonic()
const tmpPrivateKey = generator.generatePrivateKey(mnemonic)
const fromAddress = generator.deriveAddress(tmpPrivateKey)
console.log(fromAddress)

insight.getUtxos(fromAddress, (err, utxos) => {
    if(err){ 
      //Handle errors
      //console.log(err)
      return err;
    }else { 
        // use the UTXOs to create transaction with bitcore Transaction object
        let tx = bitcore.Transaction();
        tx.from(utxos);
        tx.to(ADDRESSTO, AMOUNT);
        tx.change(fromAddress);
        tx.fee(FEE);
        tx.sign(tmpPrivateKey);
        tx.serialize();
        
        // Broadcast your transaction to the Bitcoin network
        insight.broadcast(tx.toString(), (error, txid) => {
            if (error) {
                //console.log(error)
                return error;
            } else {
              // Your Transaction Id
                console.log(txid)
            }
        })
    }
})
