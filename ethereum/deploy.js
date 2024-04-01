const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const compiledCampaign = require('./build/CampaignFactory.json');

// Load environment variables from .env file
require('dotenv').config();

console.log("env ", process.env.mnemonicPhrase);
if (!process.env.mnemonicPhrase) {
    console.error("mnemonicPhrase is not defined in the environment variables.");
  } else {
    console.log("mnemonicPhrase value:", process.env.mnemonicPhrase);
  }
console.log("env" , process.env.deployedProvider);
const provider = new HDWalletProvider(
  process.env.mnemonicPhrase,
  process.env.deployedProvider
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);
  const gasPrice = await web3.eth.getGasPrice(); // Get the current gas price
  console.log('Current gas price:', gasPrice);

  const result = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface))
    .deploy({ data: compiledCampaign.bytecode })
    .send({ gas: '1000000', gasPrice, from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};

deploy();
