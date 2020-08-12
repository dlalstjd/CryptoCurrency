import keccak from 'js-sha3'
import BIP39 from 'bip39'
import pkg from 'ethereumjs-wallet'
//import { Wallet } from 'ethereumjs-wallet'
//const keccak256 = require('js-sha3').keccak256

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
}

export function derivePublicKey(privateKey){
    const { default: Wallet } = pkg
    //console.log(Wallet)
    const wallet = Wallet.fromPrivateKey(privateKey)
    return wallet.getPublicKey()
}

export function deriveAddress(publicKey){
    const{ keccak256 } = keccak
    const address = keccak256(publicKey)

    return "0x" + address.substring(address.length - 40, address.length)
}

