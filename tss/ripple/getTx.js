const { RippleAPI } = require('ripple-lib');
const assert = require('assert');

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

	console.log(prepared.txJSON)
}
