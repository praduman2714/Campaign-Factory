import web3 from "./web3";
const CampaignFactory = require('./build/CampaignFactory.json');


const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    // process.env.deployedAddress
    "0xb0701B9CDbc802E5ecdde782c1B07c560BAADBa2"
);

export default instance;