import factory from '../../../ethereum/factory';
import { useEffect, useState } from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import CreateCampaign from "@/components/dialogs/CreateCampaign";
import web3 from "../../../ethereum/web3";
import OutlinedCard from "@/components/CardComponent";

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [account, setAccount] = useState(null);

  const openCreateCampaignForm = () => {
    setOpenCreateForm(prevState => !prevState);
  };

  const fetchFromFactory = async () => {
    try {
      const campaigns = await factory.methods.getDeployedCampaigns().call();
      setCampaigns(campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const getFirstAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchFromFactory();
      await getFirstAccount();
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography className='!mt-10' variant="h4" align="center" gutterBottom>
        Campaigns
      </Typography>
      <Button 
        onClick={openCreateCampaignForm}
        variant="contained"
        color="primary"
        style={{ marginBottom: '20px', backgroundColor: '#3f51b5' }}
      >
        Create Campaign
      </Button>
      <Grid container spacing={4}>
        {campaigns.length > 0 ? campaigns.map((address, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <OutlinedCard item={address} />
          </Grid>
        )) : <Typography className='!m-8 ' >No campaigns available</Typography>}
      </Grid>
      {openCreateForm && <CreateCampaign isOpen={openCreateCampaignForm} account={account} />}
    </Container>
  );
}
