const { RippleAPI } = require('ripple-lib');
const binaryCodec = require('ripple-binary-codec');
const BN = require('bn.js');
const hashjs = require('hash.js');



//assert.ok(process.env.RIPPLE_FROM_ADDRESS, 'Please specify a RIPPLE_FROM_ADDRESS');
//assert.ok(process.env.RIPPLE_TO_ADDRESS, 'Please specify a RIPPLE_TO_ADDRESS');
//assert.ok(process.env.RIPPLE_FROM_SECRET, 'Please specify a RIPPLE_FROM_SECRET');

const api = new RippleAPI({
	  server: 'wss://s.altnet.rippletest.net:51233' // XRP Test Net
});

run().catch(error => console.error(error.stack));

async function run() {
	await api.connect();
	const fromAddress = process.argv[2];
	const toAddress = process.argv[3];
	const fromSecret = process.argv[4];

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

	const tx = JSON.parse(prepared.txJSON);
	console.log(tx);

	const txToSignAndEncode = Object.assign({}, tx);
	txToSignAndEncode.SigningPubKey = '';
	console.log(txToSignAndEncode);

	const signature = {r: "f3c7699289fc046c784235a01e750cf94208076b8beac69735a9bfb9513a6f3e", s: "084ea4c15c2d9db076518617d15099c5444fc616000f6c9b72dcf89d2bf2a1c4", recoveryParam: '1'};
	//txToSignAndEncode.TxnSignature.r = new BN("f3c7699289fc046c784235a01e750cf94208076b8beac69735a9bfb9513a6f3e", 16);
	//txToSignAndEncode.TxnSignature.s = new BN("084ea4c15c2d9db076518617d15099c5444fc616000f6c9b72dcf89d2bf2a1c4", 16);
	//txToSignAndEncode.TxnSignauture.recoveryParams = 1;
	txToSignAndEncode.TxnSignature = signature;
	console.log(txToSignAndEncode);
	const serialized = binaryCodec.encode(txToSignAndEncode);
	const res = await api.submit(serialized);

	const signingData = binaryCodec.encodeForSigning(tx);
	console.log(signingData);
	const msg = new BN(signingData, 16).toArray(null, signingData.length / 2);
	const hash = hashjs.sha512().update(msg).digest().slice(0, 32);

	console.log(hash[0].toString(16));
	var hexhash = "";
	for( var i = 0; i < hash.length; i++ ){
		hexhash += hash[i].toString(16);
	}
	
	console.log(hexhash);

	process.exit(0);
}
