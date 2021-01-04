const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const url = 'https://ropsten.infura.io/v3/18584ab189e842369a1c2e2a257791a3';
const web3 = new Web3(new Web3.providers.HttpProvider(url));
const util = require('ethereumjs-util');
const transactionArgs = process.argv.slice(2);

const from = transactionArgs[0];
const to = transactionArgs[1];
const ether = transactionArgs[2];

async function getTransaction(){
	    const non = await web3.eth.getTransactionCount(from);
	    const real_ether = await web3.utils.toWei(ether, 'ether');
	    const gasPrice = await web3.eth.getGasPrice();
	    console.log(`nonce: ${non}`);
	    console.log(`gasprice:${gasPrice}`);
	    const rawTransaction = {
		            to: to,
		            nonce: web3.utils.toHex(non),
		            value: web3.utils.toHex(real_ether),
		            gasLimit: web3.utils.toHex(21000),
		            gasPrice: web3.utils.toHex(gasPrice),
		        };

	    const tx = new Tx(rawTransaction,{chain:'ropsten', hardfork: 'petersburg'});

	    console.log(util.bufferToHex(tx.hash(false)).slice(2));

};
getTransaction();
