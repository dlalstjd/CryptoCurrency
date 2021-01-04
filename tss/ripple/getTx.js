const { RippleAPI } = require('ripple-lib');
const binaryCodec = require('ripple-binary-codec');
const BN = require('bn.js');
const hashjs = require('hash.js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


const api = new RippleAPI({
	  server: 'wss://s.altnet.rippletest.net:51233' // XRP Test Net
});

run().catch(error => console.error(error.stack));

async function run() {
	await api.connect();
	const fromAddress = process.argv[2];
	const toAddress = process.argv[3];
	const fromSecret = process.argv[4].toString(16, 64).toUpperCase();
	const fromPubKey = '03' + process.argv[5];

	const payment = {
		source:{ 
			address: fromAddress,
		    	maxAmount: {
				value: '10.00',
				currency: 'XRP'
			}
		},
	    	destination: {
		 	address: toAddress,
		        amount: {
				value: '1.00',
			    	currency: 'XRP'
			}
		}
	};

  	const prepared = await api.preparePayment(fromAddress, payment, {
		maxLedgerVersionOffset: 1000
	});
	const keypair = { 
		privateKey: fromSecret,
		publicKey:  fromPubKey
	}
	const { signedTransaction } = api.sign(prepared.txJSON, keypair);
	//const res2 = await api.submit(signedTransaction);

/*	No signature from tss

	const tx = JSON.parse(prepared.txJSON);
	const txToSignAndEncode = Object.assign({}, tx);
	txToSignAndEncode.SigningPubKey = fromPubKey;
	const signingData = binaryCodec.encodeForSigning(txToSignAndEncode);
	const hash = hashjs.sha512().update(signingData).digest().slice(0, 32);
	const msg = ec._truncateToN(new BN(hash, 16));
	
    console.log(txToSignAndEncode);
	console.log(msg);
*/
	process.exit(0);
}
