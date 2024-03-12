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

const provider = new HDWalletProvider(
  process.env.mnemonicPhrase,
  // "https://sepolia.infura.io/v3/e425bd1f491148aea5cd9d0111dff935"
  // "https://polygon-mumbai.infura.io/v3/92616fc8e61042c5aa0bbd74474a6971"
  "https://earpc.apothem.network/1ec0e5596f411c38c7cc8cca293ef1a6bc6e6f72"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface))
    .deploy({ data: compiledCampaign.bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};

deploy();
