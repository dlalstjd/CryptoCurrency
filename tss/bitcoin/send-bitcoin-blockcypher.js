import bitcoin from 'bitcoinjs-lib'
import request from 'request'
const bitcoinNetwork = bitcoin.networks.testnet;

/**
 * Send bitcoin in testnet using BlockCypher
 * @param {number} amount - Bitcoin amount in BTC
 * @param {string} to - output Bitcoin wallet address
 * @param {string} from - input Bitcoin wallet address
 * @param {string} wif 
 */
const sendBitcoin = function (amount, to, from, wif) {
  let keys = bitcoin.ECPair.fromWIF(wif, bitcoinNetwork);
  return new Promise(function (resolve, reject) {
    // create tx skeleton
    request.post({
      url: 'https://api.blockcypher.com/v1/btc/test3/txs/new',
        body: JSON.stringify({
          inputs: [{ addresses: [ from ] }],
          // convert amount from BTC to Satoshis
          outputs: [{ addresses: [ to ], value: amount * Math.pow(10, 8) }]
        }),
      },
      function (err, res, body) {
        if (err) {
          reject(err);        
        } else {
          let tmptx = JSON.parse(body);
          
          // signing each of the hex-encoded string required to finalize the transaction
          tmptx.pubkeys = [];
          tmptx.signatures = tmptx.tosign.map(function (tosign, n) {
            tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString('hex'));
            return keys.sign(new Buffer(tosign, 'hex')).toDER().toString('hex');
          });

          // sending back the transaction with all the signatures to broadcast
          request.post({
            url: 'https://api.blockcypher.com/v1/btc/test3/txs/send',
              body: JSON.stringify(tmptx),
            },
            function (err, res, body) {
              if (err) {
                reject(err);
              } else {
                // return tx hash as feedback
                let finaltx = JSON.parse(body);                
                resolve(finaltx.tx.hash);
              }
            }
          );
        }
      }
    );
  });
}