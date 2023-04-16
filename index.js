const { ethers } = require('ethers');
require("dotenv").config();

const contractAddress = process.env.TOKEN_CONTRACT_ADDRESS; // replace with your ERC20 token contract address
const contractABI = process.env.ABI;
     


let fun= async ()=>{

    const network = process.env.ALCHEMY_SEPOLIA_ENDPOINT; // replace with your Sepolia testnet API key
    const provider =  new ethers.providers.JsonRpcProvider(network);
    const wallet =  new ethers.Wallet(process.env.PRIVATE_KEY, provider); // private key of wallet
    const tokenContract =  new ethers.Contract(contractAddress, contractABI, wallet);
    
    async function transferTokens(recipientAddress, amount) {
        const tx = await tokenContract.transfer(recipientAddress, amount);
        await tx.wait();
      }
    
   
    const recipientAddress = process.env.RECIPIENT_ADDRESS; // replace with the recipient's address
    const amount = ethers.utils.parseUnits('4', 18); // replace with the amount of tokens to transfer
    
    transferTokens(recipientAddress, amount)
      .then(() => {
        console.log('Tokens transferred successfully!');
      })
      .catch((error) => {
        console.error('Error transferring tokens:', error);
      });
    
}
  


fun();
