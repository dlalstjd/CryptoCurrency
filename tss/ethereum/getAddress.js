const publicKeyToAddress = require('ethereum-public-key-to-address');

async function getAddress() {
	let x = process.argv[2];
	let y = process.argv[3];
	if (x.length < 64){
		x = '0' + x;
	}
	if (y.length < 64) {
		y = '0' + y;
	}

	const pub = '04' + x + y;
	const addr = await publicKeyToAddress(Buffer.from(pub,'hex'));
	console.log(addr);
}

getAddress();
