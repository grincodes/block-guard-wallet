const bip39 = require("bip39");
const { BIP32Factory } = require('bip32')
const ecc = require('tiny-secp256k1'); //elliptical curve implementation
const { hdkey } = require("ethereumjs-wallet");


// Step 1: Generate a BIP39 mnemonic
const mnemonic = bip39.generateMnemonic();
console.log("Mnemonic:", mnemonic);

// Step 2: Convert mnemonic to seed (BIP39)
const seed = bip39.mnemonicToSeedSync(mnemonic);


// Step 3: Use BIP32 to generate the root key

const bip32 = BIP32Factory(ecc)
const root = bip32.fromSeed(seed)



// Step 4: Derive the HD wallet path using BIP44 for Ethereum (m/44'/60'/0'/0)
const derivationPath = "m/44'/60'/0'/0/0"; // 1st Ethereum account
const child = root.derivePath(derivationPath);


// Step 5: Convert the child node to an Ethereum address
//to base58 encodes binary data to readable format.
//Base58 removes characters that could be confusing for humans, such as 0 (zero), O (capital letter O), 
//l (lowercase L), and I (capital letter I).
// This makes Base58 more user-friendly and reduces the risk of transcription errors.
const wallet = hdkey.fromExtendedKey(child.toBase58()).getWallet();
;

const address = "0x" + wallet.getAddress().toString("hex");
const privateKey = wallet.getPrivateKey().toString("hex");

console.log("Ethereum Address:", address);
console.log("Private Key:", privateKey);

