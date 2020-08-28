import Web3 from 'web3'
import BIP39 from 'bip39'
import pkg from 'ethereumjs-wallet'
import bs58 from 'bs58'
import EC from 'elliptic'
import sha256 from 'js-sha256'
import ripemd160 from 'ripemd160'
import bitcore from 'bitcore-lib'

const { hdkey } = pkg
const { ec } = EC
const web3 = new Web3()

// generatae a mnemonic
export function generateMnemonic(){
    return BIP39.generateMnemonic()
}

// generate a seed
export function generateSeed(mnemonic){
    return BIP39.mnemonicToSeed(mnemonic)
}

// generate "a" private key
// if wanna make more private key, modifiy this function
export function generatePrivateKey(mnemonic){
    const seed = generateSeed(mnemonic).toString()
    /*
    const hash = new bitcore.crypto.Hash.sha256(Buffer.from(seed))
    const bn = new bitcore.crypto.BN.fromBuffer(hash)
    const privateKey = new bitcore.PrivateKey(bn)
    */
    
    const rootKey = hdkey.fromMasterSeed(seed)
    //hd address
    const hardenedKey = rootKey.derivePath("m/44' /60' /0' /0'")
    const childKey = hardenedKey.deriveChild(0)
    const wallet = childKey.getWallet()
    const privateKey = wallet.getPrivateKey()
    return privateKey
    /* create private key by bitcore
    const privateKey = new bitcore.PrivateKey()
    console.log(privateKey)
    */
}

// generate public key
// uncompress sec // compressed sec
export function derivePublicKey(privateKey){
    const ecdsa = new ec('secp256k1')
    const keys = ecdsa.keyFromPrivate(privateKey)
    const publicKey = keys.getPublic('hex').substring(2, 66)
    return "03"+publicKey
}

// generate address from public key ( double hashing )
export function deriveAddress(publicKey){
    const hash = sha256(Buffer.from(publicKey, 'hex'))
    const publicKeyHash = new ripemd160().update(Buffer.from(hash, 'hex')).digest()
    // 1. add prefix "6F"( means bitcoin TESTNET address ) in public key hash
    // For mainnet, should add prefix "00"
    const prefixPublicKey = Buffer.from("6F" + publicKeyHash.toString('hex'), 'hex')
    // 2. create SHA256 hash double time
    const onceHash = sha256(prefixPublicKey)
    const doubleHash = sha256(Buffer.from(onceHash, 'hex'))
    // 3. find the 1st 4 bytes
    const checksum = doubleHash.substring(0, 8)
    // 4. concatenate double hashed public key and checksum
    const prefixPublicKeyChecksum = prefixPublicKey.toString('hex') + checksum
    // 5. base 58 check encode => address
    const address = bs58.encode(Buffer.from(prefixPublicKeyChecksum, 'hex'))
    return address
}


// generate WIF from private key
export function deriveWIF(privateKey){
    const privateKeyHex = web3.utils.toHex(Buffer.from(privateKey, 'hex')).toString().substring(2)
    // 1. add prefix "08"( means private key wif ) in private key hash
    const prefixPrivateKey = Buffer.from("80" + privateKeyHex, 'hex')
    // 2. create SHA256 hash double time
    const onceHash = sha256(prefixPrivateKey)
    const doubleHash = sha256(Buffer.from(onceHash, 'hex'))   
    // 3. find the 1st 4 bytes
    const checksum = doubleHash.substring(0, 8)
    // 4. concatenate double hashed private key and checksum
    const prefixPrivateKeyChecksum = prefixPrivateKey.toString('hex') + checksum
    // 5. base 58 check encode => wif from private key
    const privateKeyWIF = bs58.encode(Buffer.from(prefixPrivateKeyChecksum, 'hex'))
    return privateKeyWIF
}

// address from WIF using bitcore-lib
export function deriveAddressFromWIF(privateKeyWIF){
    const privateKeyfromWIF = new bitcore.PrivateKey(privateKeyWIF)
    const addressFromWIF = privateKeyfromWIF.toAddress()
    return addressFromWIF
}


/* Other way : bitcoinjs-lib
const testnet = bitcoin.networks.testnet
const keypair = bitcoin.ECPair.makeRandom({network:testnet}) // _D: private key, _Q: public key, option: compressed?
const prikey = keypair.privateKey
const pubkey = keypair.publicKey
const w = keypair.toWIF()
//const addr = keypair.getAddress()
//const pk = keypair.toWIF()
*/



/*
const mnemonic = generator.generateMnemonic()
const tmpPrivateKey = generator.generatePrivateKey(mnemonic)
const tmpPublicKey = generator.derivePublicKey(tmpPrivateKey)
console.log(ecc.pointFromScalar(tmpPrivateKey, 0))
console.log(tmpPublicKey)
//const wif = generator.deriveWIF(tmpPrivateKey)
//const fromAddress = generator.deriveAddress(tmpPublicKey)
//const pk = WIF.encode(testnet.wif, tmpPrivateKey, true)
*/


/*
const keypair = bitcoin.ECPair.makeRandom({ testnet })
const pubkey = keypair.publicKey
const addressObject = bitcoin.payments.p2pkh( {pubkey, testnet} )
*/