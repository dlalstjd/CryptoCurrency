# Bitcore Insights

A module for [bitcore](https://github.com/bitpay/bitcore) that implements HTTP requests to different Web APIs to query the state of the blockchain.

## Getting started

Be careful! When using this module, the information retrieved from remote servers may be compromised and not reflect the actual state of the blockchain.

```sh
npm install bitcore-insight
bower install bitcore-insight
```
## Insight
### Description
`Insight` is a simple agent to perform queries to an Insight blockchain explorer. The default servers are `https://insight.bitpay.com` and `https://test-insight.bitpay.com`, hosted by BitPay Inc. You can (and we strongly suggest you do) run your own insight server. For more information, head to [https://github.com/bitpay/insight-api](https://github.com/bitpay/insight-api)

This Insight module allows you to:
- Get the UTXOs of a Bitcoin address to create a transaction with a Bitcore transaction object.
- Broadcast a Bitcore transaction object to the Bitcoin Network (Mainnet or Testnet)

#### Retrieving Unspent UTXOs for an Address (or set of)
```javascript
const Insight = require('bitcore-insight').Insight;
let insight = new Insight('testnet');
// Create a transaction
insight.getUtxos('Bitcoin Address From', (err, utxos) => {
  if (err) {
    // Handle errors...
  } else {
    // Maybe use the UTXOs to create a transaction
  }
});
```
Where `utxos` is returned with the following object.
```json
utxos: {
  "address": "Bitcoin Address",
  "amount": "Bitcoin Balance",
  "scriptPubKey": "Hash",
  "txid": "Hash",
  "vout": "Number" // Int 
}
```

#### Retrieving Transactions and Balance of an Address
```javascript
const Insight = require('bitcore-insight').Insight;
let insight = new Insight('testnet');

// Create a transaction
insight.address('Bitcoin Address', (err, address) => {
  if (err) {
    // Handle errors...
  } else {
    return address;
  }
});
```
Where `address` is returned with the following object.
```json
address: {
  "address":{
    "hash": "hash",
    "type": "pubkeyhash",
    "network": "mainnet/testnet"
  },
  "balance" : "Number of Satoshis", // Int
  "totalReceived" : "Number of Satoshis", // Int
  "totalSent" : "Number of Satoshis", // Int
  "transactionIds" : ["Transaction Id"], // array
  "unconfirmedBalance" : "Number of Satoshis" // Int
}
```

#### Retrieving Transaction by Transaction ID
```javascript
const Insight = require('bitcore-insight').Insight;
let insight = new Insight('testnet');

// Create a transaction
insight.getTransaction('Bitcoin Transaction Id', (err, txid) => {
  if (err) {
    // Handle errors...
  } else {
    return txid;
  }
});
```
Bitcoin's UTXO model does two transactions from its total balance to the receiving address and to its change address. For instance in the transaction below you can see `valueIn` = `fees` + `valueOut`. So where you see `vin` that is the input value and you have two `vout` transactions, one is to the address we want to send bitcoin to and the other is our own address to get the remaining bitcoin.

Where `txid` is returned with the following object. This is a sample transaction.
```json
txid: {
  "blockhash": "00000000610ab87dd4c01d5684ad7765e2a24868314f523c849069e92683baf1",
  "blockheight": 1259756,
  "blocktime": 1516504693,
  "confirmations": 193967,
  "fees": 0.0005, // in BTC
  "locktime": 0,
  "size": 224,
  "time": 1516504693,
  "txid": "c0dd2c6ad7894c926d0d157fead487f46e7cdf3bf7ab271b68475b5c9f335e19",
  "valueIn": 0.5479, // in BTC
  "valueOut": 0.5474, // in BTC
  "version": 1,
  "vin": [{
    "addr": "moCEHE5fJgb6yHtF9eLNnS52UQVUkHjnNm",
    "doubleSpentTxID": null,
    "n": 0,
    "scriptSig": {
      "hex": "hex value", 
      "asm": "asm value"
      },
  "sequence": 4294967295,
  "txid": "8e1d5d56b8c6455d64cf582f2bcdc40c5efc02a27f0c95b3fdbe11c906148fe3",
  "value": 0.5479,
  "valueSat": 54790000,
  "vout": 1
}],
"vout": (2) [
  {"n": 0,
  "scriptPubKey": {
    "hex": "a9149b9b6fa42d6d4a26ec4d4f09e77a5408d073cfb587", 
    "asm": "OP_HASH160 9b9b6fa42d6d4a26ec4d4f09e77a5408d073cfb5 OP_EQUAL", 
    "addresses": ["2N7RzvuZvDjUyoLdQTJd4xYKsuA52MtA3H9"], 
    "type": "scripthash"
    },
  "spentHeight": 1260665,
  "spentIndex": 2,
  "spentTxId": "1e7345484fc49202455738997ee0191c28da1f47bc649ab931aa490efdcb30a0",
  "value": "0.00100000"},
  {"n": 1,
"scriptPubKey": {
  "addresses": ["moCEHE5fJgb6yHtF9eLNnS52UQVUkHjnNm"],
  "asm": "OP_DUP OP_HASH160 5436727c70d7ed1ce5be6daedaaa69f130444f2b OP_EQUALVERIFY OP_CHECKSIG",
  "hex": "76a9145436727c70d7ed1ce5be6daedaaa69f130444f2b88ac",
  "type": "pubkeyhash"
  },
  "spentHeight": 1259756,
  "spentIndex": 0,
  "spentTxId": "026a4a1571ab07e239a0cc02134bd3df7d158b625678cf80424db30f21105cbf",
  "value": "0.54640000"}
  ]
}
```

#### Broadcasting a Transaction

```javascript
const Insight = require('bitcore-insight').Insight;
let insight = new Insight('testnet');

// Sending the transaction to the Bitcoin network

insight.broadcast(tx, (err, returnedTxId) => {
  if (err) {
    // Handle errors...
  } else {
    // Mark the transaction as broadcasted
  }
});
```




## License

Code released under [the MIT license](https://github.com/bitpay/bitcore/blob/master/LICENSE).

Copyright 2013-2015 BitPay, Inc. Bitcore is a trademark maintained by BitPay, Inc.

[bitcore]: http://github.com/bitpay/bitcore-explorers
