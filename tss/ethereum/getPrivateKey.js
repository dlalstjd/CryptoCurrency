const Web3 = require('web3');
const url = 'https://ropsten.infura.io/v3/18584ab189e842369a1c2e2a257791a3';
const web3 = new Web3(new Web3.providers.HttpProvider(url));

async function getPrivateKey() {
	var priv = BigInt("0");
	const privArray = process.argv.slice(3);
	const fieldOrder = BigInt(process.argv[2]);
	const len = privArray.length;
	for(var i=0; i<len; i++){
		priv = priv + BigInt(privArray[i]);
		}
	priv = web3.utils.toHex((priv % fieldOrder).toString());
	console.log(priv);
}

getPrivateKey();
