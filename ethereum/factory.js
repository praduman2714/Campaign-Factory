import web3 from './web3';
const CampaignFactory = require('./build/CampaignFactory.json');

const instance = new web3.eth.Contract(
    CampaignFactory.abi, // Use abi instead of interface
    "0x9d256B32118b8587F248AA7FAae4923c9C54F789"
);

export default instance;
