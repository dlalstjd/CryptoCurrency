const { RippleAPI } = require('ripple-lib');
const binaryCodec = require('ripple-binary-codec');
const BN = require('bn.js');
const hashjs = require('hash.js');
const utils = require('minimalistic-crypto-utils');

const api = new RippleAPI({
	  server: 'wss://s.altnet.rippletest.net:51233' // XRP Test Net
});

run().catch(error => console.error(error.stack));

function rmPadding(buf) {
	var i = 0;
	var len = buf.length - 1;
	while (!buf[i] && !(buf[i + 1] & 0x80) && i < len) {
		i++;
	}
	if (i === 0) {
	    return buf;	
	}
	return buf.slice(i);
}

function constructLength(arr, len) {
	if (len < 0x80) {
      arr.push(len);
	  return;
	}
	var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
	arr.push(octets | 0x80);
	while (--octets) {
		arr.push((len >>> (octets << 3)) & 0xff);
	}
	arr.push(len);
}

function toDER(signature, env){
	var r = signature.r.toArray();
	var s = signature.s.toArray();

  	if (r[0] & 0x80) r = [ 0 ].concat(r);
	if (s[0] & 0x80) s = [ 0 ].concat(s);

	r = rmPadding(r);
	s = rmPadding(s);

	while (!s[0] && !(s[1] & 0x80)) {
		s = s.slice(1);
	}
	var arr = [ 0x02 ];
	constructLength(arr, r.length);
	arr = arr.concat(r);
	arr.push(0x02);
	constructLength(arr, s.length);
	var backHalf = arr.concat(s);
	var res = [ 0x30 ];
	constructLength(res, backHalf.length);
	res = res.concat(backHalf);

	return utils.encode(res, env);
}


async function run() {
	await api.connect();
	var r = new BN(process.argv[6], 16);
	var s = new BN(process.argv[7], 16);
	var rocoveryParam = process.argv[8];
	const fromAddress = process.argv[2]; 
	const toAddress = process.argv[3];
	const fromSecret = process.argv[4].toString(16, 64).toUpperCase();
	const fromPubKey = '03'+process.argv[5];

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
		maxLedgerVersionOffset: 100000000000
	});
	
	const tx = JSON.parse(prepared.txJSON);
	tx.Fee = '100';
	const txToSignAndEncode = Object.assign({}, tx);
	txToSignAndEncode.SigningPubKey = fromPubKey;

	const Sig = {	
		r: r,
		s: s,
		recoveyParam: rocoveryParam
	}
	const signature = toDER(Sig).map((byteValue) => {
		const hex = byteValue.toString(16).toUpperCase();
		return hex.length > 1 ? hex : `0${hex}`;
	}).join('');

	txToSignAndEncode.TxnSignature = signature;
	txToSignAndEncode.LastLedgerSequence = 13761449;

	console.log(txToSignAndEncode);
	
	const serialized = binaryCodec.encode(txToSignAndEncode);
	console.log(serialized);

	const res2 = await api.submit(serialized);

	console.log(res2);

	process.exit(0);
}