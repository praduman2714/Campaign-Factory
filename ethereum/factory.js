import web3 from "./web3";
const CampaignFactory = require('./build/CampaignFactory.json');


const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    // process.env.deployedAddress
    "0xEf484067118da290e9765eCEd3a348d01684793C"
);

export default instance;