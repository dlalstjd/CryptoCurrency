const bitcoin = require('bitcoinjs-lib');
const testnet = bitcoin.networks.testnet;

async function sendBitCoin(){
	const params = process.argv.slice(2);
	const prevTx = params[0];
	const privateKey = params[1];
	const amount = params[2];
	const minerfee = params[3];
	const toAddress = params[4];
	const index = params[5];
	const r = params[6];
	const s = params[7];
	
	const txb = new bitcoin.Psbt({network: testnet});
	const utxo = bitcoin.Transaction.fromHex(prevTx);

	let inputDatas = {
		hash: utxo.getId(),
		index: index,
		nonWitnessUtxo: Buffer.from(prevTx, 'hex'),
	}
	txb.addInput(inputDatas);

	let outputDatas = {
		address: toAddress,
		value: amount - minerfee,
	}
	txb..addOutput(outputDatas)

	const signer = bitcoin.ECpair.fromPrivateKey(Buffer.from(privateKey, 'hex'));

    	txb.signInput_tss(0, signer, Buffer.from(r + s, 'hex')) // sign using r ,s value from tss
	console.log(txb.validateSignaturesOfInput(0, signer.publicKey))

	txb.finalizeAllInputs()

	const transaction = txb.extractTransaction()
	const signedTransaction = transaction.toHex()
	const transactionId = transaction.getId()

	console.log({ signedTransaction: signedTransaction, transactionId: transactionId })
}
