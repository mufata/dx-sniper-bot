const Web3 = require('web3');
const fs = require('fs');

// Initialize web3
const web3 = new Web3();

// Number of wallets to generate
const numWallets = 10;

// Generate wallets
const wallets = Array.from({ length: numWallets }, () => {
  const wallet = web3.eth.accounts.create();
  // Remove '0x' from the private key
  const privateKey = wallet.privateKey.substring(2);
  return { privateKey, address: wallet.address };
});

// Save private keys and addresses in config.json
const config = { 
  privateKeys: wallets.map(wallet => wallet.privateKey),
  addresses: wallets.map(wallet => wallet.address)
};
fs.writeFileSync('config.json', JSON.stringify(config, null, 2));