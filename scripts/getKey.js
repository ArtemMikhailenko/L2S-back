// scripts/getKey.js
const TonMnemonic = require('tonweb-mnemonic');
const mnemonicToWalletKey = typeof TonMnemonic.mnemonicToWalletKey === 'function'
  ? TonMnemonic.mnemonicToWalletKey
  : TonMnemonic.default;

async function main() {
  const words = [
    "immune",
    "review",
    "monitor",
    "enforce",
    "smoke",
    "awkward",
    "document",
    "husband",
    "despair",
    "mixed",
    "physical",
    "flag",
    "lounge",
    "item",
    "worth",
    "during",
    "exact",
    "market",
    "earn",
    "silent",
    "juice",
    "torch",
    "liquid",
    "pair"
  ];

  if (typeof mnemonicToWalletKey !== 'function') {
    throw new Error('mnemonicToWalletKey is not a function');
  }

  const keyPair = await mnemonicToWalletKey(words);
  console.log('Public Key:', keyPair.publicKey.toString('hex'));
  console.log('Secret Key:', keyPair.secretKey.toString('hex'));
}

main().catch(console.error);
