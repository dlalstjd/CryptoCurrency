//import bitcoin from 'bitcoinjs-lib'
const bitcoin = require('bitcoinjs-lib');
const testnet = bitcoin.networks.testnet

// get faucet from https://coinfaucet.eu/en/btc-testnet/
// get raw transaction hex from https://testnet-api.smartbit.com.au/v1/blockchain/transaction/3e98d87f9eff111b7f032129371a77db404a473bad1900593c8b7d74774a72f8/hex
// create transaction
function createTransaction(){
    const txb = new bitcoin.Psbt({ network: testnet }) 
    // input
    	const params = process.argv.slice(2);
        const prevTx = params[0];
	const privateKey = Buffer.from(params[1],'hex');
	const amount = params[2];
        const minerfee = params[3];
        const toAddress = params[4];
	const index = Number(params[5]);
	const r = params[6];
	const s = params[7];

    const utxo = bitcoin.Transaction.fromHex(prevTx)
	console.log(utxo); 
//const ecPublic = bitcoin.ECPair.fromPrivateKey(privateKey, { network: testnet })
    //const p2pkh = bitcoin.payments.p2pkh({ pubkey: ecPublic.publicKey, network: testnet })
    let inputDatas= {
        hash:  utxo.getId(),
        index: index,
        nonWitnessUtxo: Buffer.from(prevTx, 'hex'),
    }
    txb.addInput(inputDatas)

    // output
    let outputDatas = {
        address: toAddress,
        value: amount - minerfee
    }
    txb.addOutput(outputDatas)

    // In bitcoin, must sign all input
    const signer = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))

    //txb.signInput(0, signer) - sign using general way

    //signInput_tss, made by me,is for tss. can find at "node_modules/bitcoinjs-lib/src/psbt.js" in line 488
    //so must send r, s buffer that first 32bytes is r, the others is s 
    txb.signInput_tss(0, signer, Buffer.from( r+s, 'hex')) // sign using r ,s value from tss
    console.log(txb.validateSignaturesOfInput(0, signer.publicKey))

    txb.finalizeAllInputs()

    const transaction = txb.extractTransaction()
    const signedTransaction = transaction.toHex()
    const transactionId = transaction.getId()

    console.log({ signedTransaction: signedTransaction, transactionId: transactionId })

    // push transaction
    // https://live.blockcypher.com/btc/pushtx/
}

createTransaction();
