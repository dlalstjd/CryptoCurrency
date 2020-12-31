const { RippleAPI } = require('ripple-lib');
const binaryCodec = require('ripple-binary-codec');
const BN = require('bn.js');
const hashjs = require('hash.js');
const utils = require('minimalistic-crypto-utils');

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
	//console.log( signedTransaction );
	//const res =  await api.submit(signedTransaction);

	const tx = JSON.parse(prepared.txJSON);

	const txToSignAndEncode = Object.assign({}, tx);
	txToSignAndEncode.SigningPubKey = fromPubKey;
	
	//const signingData = binaryCodec.encodeForSigning(tx);
	const signingData = "5354580012000022800000002400CF67D4201B00CFE2D961400000000098968068400000000000000C73210349E4AAE8AA152131F5ED3CD2388103C796EE329D2B90CD6200D7893CE6E0B7E481142CCCE967D37287DB8CB629FA23470616AD00BB6C831413CFAA99A4F29526C28097758305F354F8AF0F04";
	
	//console.log(signingData);
	//const msg = new BN(signingData, 16).toArray(null, signingData.length / 2);
	const hash = hashjs.sha512().update(signingData).digest().slice(0, 32);

	//console.log(hash[0].toString(16));
	var hexhash = "";
	for( var i = 0; i < hash.length; i++ ){
		hexhash += hash[i].toString(16);
	}
	
	console.log(hexhash);

	process.exit(0);
}
