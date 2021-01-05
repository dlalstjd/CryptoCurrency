const bitcore = require('bitcore-lib');
const bs58 = require('bs58');
const EC = require('elliptic');
const sha256 = require('js-sha256');
const ripemd160 = require('ripemd160');

async function getAddress(){
	const publicKey = "03" + process.argv[2];
	const hash = sha256(Buffer.from(publicKey, 'hex'));
	const publicKeyHash = new ripemd160().update(Buffer.from(hash, 'hex')).digest();
    	const prefixPublicKey = Buffer.from("6F" + publicKeyHash.toString('hex'), 'hex');
    	const onceHash = sha256(prefixPublicKey);
	const doubleHash = sha256(Buffer.from(onceHash, 'hex'));
	const checksum = doubleHash.substring(0, 8);
    	const prefixPublicKeyChecksum = prefixPublicKey.toString('hex') + checksum;
    	const address = bs58.encode(Buffer.from(prefixPublicKeyChecksum, 'hex'));

	console.log(address);
}

getAddress();
