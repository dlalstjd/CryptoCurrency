# cryptocoins

Research most crypto coins hash, address and signature algorithm.

| No | Name | Type | Signging Alg | Curve | Hash | Address encoding | Address hash | ref. |
| 1 | Bitcoin | UXTO | ECDSA | secp256k1 | SHA-256 | base58, bech32 | SHA-256, RIPEMD-160 |  |
| 2 | Ethereum | account | ECDSA | secp256k1 | Keccak-256 | none | last 20B of Keccak-256 |  |
| 3 | XRP | account | ECDSA | secp256k1 | first half of SHA-512 | base58 with different alphabet | SHA-256, RIPEMD-160 |  |
| 4 | Bitcoin Cash | UXTO | ECDSA | secp256k1 | SHA-256 | base58, bech32 | SHA-256, RIPEMD-160 | almost same as Bitcoin, except address format |
| 6 | EOS | account | ECDSA | secp256k1 | SHA-256 | none | none |  |
| 7 | Litecoin | UTXO | ECDSA | secp256k1 | SHA-256 | base58, bech32 | SHA-256, RIPEMD-160 |  |
| 8 | Cardano | UTXO | EdDSA | ed25519 | none and SHA-512 in EdDSA | base58 | none |  |
| 10 | Tether | - | ECDSA | secp256k1 | SHA256 | - | - | Bitcoin Omni layer / Ethereum ERC-20 token |
| 11 | TRON | UTXO | ECDSA | secp256k1 | SHA-256 | base58 | last 20B of Keccak-256 |  |
| 12 | Ethereum Classic | account | ECDSA | secp256k1 | Keccak-256 | none | last 20B of Keccak-256 | Same as Ethereum |
| 13 | Tezos | account | EdDSA, ECDSA | ed25519, secp256k1, secp256r1 | BLAKE2 and SHA-512 in EdDSA | base58 | BLAKE2 |  |
| 14 | Qtum | - | ECDSA | secp256k1 | - | - | - |  |
| 15 | Ontology | account | ECDSA | nist256p1 | 3x SHA-256 | base58 | SHA-256, RIPEMD-160 |  |
| 16 | Ravencoin | - | ECDSA | secp256k1 | - | - | - |  |
| 16 | Binance Coin | account | ECDSA | secp256k1 | - | - | - | Ethereum ERC-20 token |
| 16 | Klaytn | account | ECDSA | secp256k1 | Keccak-256 | none | last 20B of Keccak-256 |  |
