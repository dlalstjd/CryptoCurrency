const Caver = require('caver-js')
const caver = new Caver('https://api.baobab.klaytn.net:8651/')

async function getTx() {
    // Add a keyring to caver.wallet
    const keyring = caver.wallet.keyring.createFromPrivateKey('0x1db3e1680e6a9a6b9dc42d5d40c0e92b4ff486c8946b1c592c4cc9057caa109c')
    caver.wallet.add(keyring)

    // Create a value transfer transaction
    const valueTransfer = new caver.transaction.valueTransfer({
        from: keyring.address,
        to: '0x176ff0344de49c04be577a3512b6991507647f72',
        value: 1,
        gas: 30000,
    })

    // Sign the transaction via caver.wallet.sign
    await valueTransfer.getHash(keyring);
}

getTx();