const Web3 = require("web3");
const fs = require("fs");

const web3 = new Web3("");

// Read private keys and addresses from config.json
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const pkToUse = config.privateKeys[0]; // Use the first private key

const account = web3.eth.accounts.privateKeyToAccount(pkToUse);

const amountInEther = "0.015"; // Set the amount you want to send here


async function sendEth() {
  console.log(`Spreading The ETH`);

  try {
    const maxFee = "1.5001";
    const maxFeePerGas = web3.utils.toWei(maxFee, 'gwei');
    const maxPriorityFeePerGas = web3.utils.toWei('1.5', 'gwei');

    const nonce = await web3.eth.getTransactionCount(account.address);

    const sendTransactions = config.addresses.map(async (receiverAddress, index) => {
      

      const amountToSend = web3.utils.toWei(amountInEther, 'ether');

      const tx = await account.signTransaction({
        to: receiverAddress,
        value: amountToSend,
        gas: 21000,
        maxFeePerGas: maxFeePerGas.toString(),
        maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
        nonce: nonce + index,
      });

      const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
      console.log(`Transaction ${index + 1} Success:`, receipt.transactionHash);
    });

    await Promise.all(sendTransactions);
    console.log(`all done`);
  } catch (error) {
    console.error('Error:', error);
  }
  return true;
}

sendEth().then(() => {
  console.log('All transaction done.');
}).catch((error) => {
  console.error(`Error on sending tx: ${error.message}`);
});