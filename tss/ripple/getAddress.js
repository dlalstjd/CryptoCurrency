const rippleLib = require('ripple-lib').RippleAPI;
const EC = require('elliptic').ec;


function getAddress(){
	const api = new rippleLib();
	const ec = new EC('secp256k1');
	const publicKey = '03' + process.argv[2].toUpperCase();
	console.log(publicKey);	
	const address = api.deriveAddress(publicKey);
	console.log(address);

	const privateKey = process.argv[3];
	console.log( ec.keyFromPrivate(privateKey).getPublic().encodeCompressed().toString());

}

getAddress();
