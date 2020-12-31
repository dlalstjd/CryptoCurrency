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
				value: '10.00',
			    	currency: 'XRP'
			}
		}
	};

  	const prepared = await api.preparePayment(fromAddress, payment, {
		maxLedgerVersionOffset: 5
	});
	const keypair = { privateKey: fromSecret,
		publicKey:  fromPubKey
	}
	const { signedTransaction } = api.sign(prepared.txJSON, keypair);

	const tx = JSON.parse(prepared.txJSON);
	const txToSignAndEncode = Object.assign({}, tx);
	txToSignAndEncode.SigningPubKey = fromPubKey;
	console.log(txToSignAndEncode);
	const signingData = binaryCodec.encodeForSigning(txToSignAndEncode);
	const hash = ec._truncateToN(new BN(hashjs.sha512().update(signingData).digest().slice(0, 32), 16));
	
	/*
	const hash = hashjs.sha512().update(signingData).digest().slice(0, 32);
	var hash_hex = "";
	for( var i = 0; i < hash.length; i++ ){
		hash_hex += hash[i].toString(16);
	}
	console.log(hash_hex);
	*/

	//console.log(hash);
	process.exit(0);
}
