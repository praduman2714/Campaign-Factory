const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: "1000000" });

    await factory.methods.createCampaign("100").send({
        from: accounts[0],
        gas: "1000000",
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe("Campaigns", () => {
    it("deploys a factory and a campaign", () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('mark the caller as the manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    })

    it('allows people to contribute money and mark them as approver', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    })

    it('require a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            })
            assert(false);
        } catch (error) {
            assert(error);
        }
    })

    it('allows manager to create a request for money', async () => {
        try {
            await campaign.methods.createRequest(
                'Buy Batteries', '100', accounts[1]
            ).send({
                from: accounts[0],
                gas: '1000000'
            });

            const createdRequest = await campaign.methods.requests(0).call();
            assert.equal('Buy Batteries', createdRequest.description);
        } catch (error) {
            assert(error);
            console.log("error is comng ***************");
            console.error(error);
        }
    });

    it("processes requests", async () => {
        await campaign.methods.contribute().send({
          from: accounts[0],
          value: web3.utils.toWei("10", "ether"),
        });
    
        await campaign.methods
          .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
          .send({ from: accounts[0], gas: "1000000" });
    
        await campaign.methods.approveRequest(0).send({
          from: accounts[0],
          gas: "1000000",
        });
    
        await campaign.methods.finalizeRequest(0).send({
          from: accounts[0],
          gas: "1000000",
        });
    
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, "ether");
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104);
      });
});