import * as generator from './KeyGenerator.js'
import bitcoin from 'bitcoinjs-lib'
import WIF from 'wif'
const testnet = bitcoin.networks.testnet

const mnemonic = generator.generateMnemonic()
const privateKey = generator.generatePrivateKey(mnemonic)
const publicKey = generator.derivePublicKey(privateKey)
const address = generator.deriveAddress(publicKey)
// mquDX35LKQZYDoe2rha75Rjo8FqHGEtozz, 0318ab68c02f2381da94bacce01a2fa83d889689117533d64101f539e6c6d2e7fa

// get faucet from https://coinfaucet.eu/en/btc-testnet/
// tx hash: 3e98d87f9eff111b7f032129371a77db404a473bad1900593c8b7d74774a72f8
// get raw transaction hex from https://testnet-api.smartbit.com.au/v1/blockchain/transaction/3e98d87f9eff111b7f032129371a77db404a473bad1900593c8b7d74774a72f8/hex
// raw transaction hex : 020000000001018251e5c5e14fe7eba4c4a7064e0665abe673817ba3d7bdca70723af298dded810000000017160014f99d70594b60962af538136d2f5cc3cf5dae1ea3feffffff0215f394a30100000017a914f4d8e132336fe380ec00dd9268cd5036f3f5a66587af891c00000000001976a91471e71e01e7e4b6c37d3b3bae950ac6fc44ce0d0588ac0247304402203980a7ec316c147ef5882949b1d40087dac54d213b84ffe24570a4d4b3975da102202101691aed37811ac8e192a6751454781443529ec7c86b5f7fcb2dba3485a6f4012102f557fbc7a00e7776340b586b58dd7f2abcb45feab56b617cac75dfed686b0e7460971b00
// create transaction
const txb = new bitcoin.Psbt({ network: testnet }) 
// input
const prevTx = "020000000001018251e5c5e14fe7eba4c4a7064e0665abe673817ba3d7bdca70723af298dded810000000017160014f99d70594b60962af538136d2f5cc3cf5dae1ea3feffffff0215f394a30100000017a914f4d8e132336fe380ec00dd9268cd5036f3f5a66587af891c00000000001976a91471e71e01e7e4b6c37d3b3bae950ac6fc44ce0d0588ac0247304402203980a7ec316c147ef5882949b1d40087dac54d213b84ffe24570a4d4b3975da102202101691aed37811ac8e192a6751454781443529ec7c86b5f7fcb2dba3485a6f4012102f557fbc7a00e7776340b586b58dd7f2abcb45feab56b617cac75dfed686b0e7460971b00"
const utxo = bitcoin.Transaction.fromHex(prevTx)
const ecPublic = bitcoin.ECPair.fromPrivateKey(privateKey, { network: testnet })
const p2pkh = bitcoin.payments.p2pkh({ pubkey: ecPublic.publicKey, network: testnet })
let inputDatas= {
    hash:  utxo.getId(),
    index: 1,
    nonWitnessUtxo: Buffer.from(prevTx, 'hex'),
}
txb.addInput(inputDatas)
// output
const amount = 1550000
const minerfee = 10000
let outputDatas = {
    address: 'mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB',
    value: amount - minerfee
}
txb.addOutput(outputDatas)

// sign - valid
const signer = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
txb.signInput(0, signer)
txb.validateSignaturesOfInput(0, signer.publicKey)

txb.finalizeAllInputs()

const transaction = txb.extractTransaction()
const signedTransaction = transaction.toHex()
const transactionId = transaction.getId()

console.log({ signedTransaction: signedTransaction, transactionId: transactionId })

// push transaction
// https://live.blockcypher.com/btc/pushtx/