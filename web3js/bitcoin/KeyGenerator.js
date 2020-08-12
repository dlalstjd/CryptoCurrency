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
    const { hdkey } = pkg
    const seed = generateSeed(mnemonic).toString()
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

// generate public key that is uncompressed
export function derivePublicKey(privateKey){
    const ecdsa = new ec('secp256k1')
    const keys = ecdsa.keyFromPrivate(privateKey)
    const publicKey = keys.getPublic('hex')
    return publicKey
}

// generate address from public key ( double hashing )
export function deriveAddress(publicKey){
    const hash = sha256(Buffer.from(publicKey, 'hex'))
    const publickeyHash = new ripemd160().update(Buffer.from(hash, 'hex')).digest()
    const publicKeyHash = web3.utils.toHex(Buffer.from(publickeyHash, 'hex')).toString().substring(2)
    // 1. add prefix "00"( means bitcoin address ) in public key hash
    const prefixPublicKey = Buffer.from("00" + publicKeyHash, 'hex')
    // 2. create SHA256 hash double time
    const onceHash = sha256(prefixPublicKey)
    const doubleHash = sha256(Buffer.from(onceHash, 'hex'))
    // 3. find the 1st 4 bytes
    const checksum = doubleHash.substring(0, 8)
    // 4. concatenate double hashed public key and checksum
    const prefixPublicKeyChecksum = prefixPublicKey.toString('hex') + checksum
    // 5. base 58 check encode => address
    const address = bs58.encode(Buffer.from(prefixPublicKeyChecksum, 'hex'))
    //console.log(bs58.decode(address))
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

/*
// encode hex private key t0 wif
const wif = bs58.encode(privateKey)
console.log(wif)
*/
