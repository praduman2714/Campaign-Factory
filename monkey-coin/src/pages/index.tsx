import factory from '../../../ethereum/factory';
import { useEffect, useState } from "react";
import { Paper, Button, Container, Grid, Typography } from "@mui/material";
import CreateCampaign from "@/components/dialogs/CreateCampaign";
import web3 from "../../../ethereum/web3";
import OutlinedCard from "@/components/CardComponent";
import Swal from 'sweetalert2';


export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [account, setAccount] = useState(null);

  const openCreateCampaignForm = () => {
    setOpenCreateForm(prevState => !prevState);
  };
  const explorerUrl = process.env.explorer;

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
    if (accounts.length === 0) {
      Swal.fire({
        title: 'MetaMask Required',
        text: 'Please install MetaMask to interact with this application.',
        icon: 'warning',
        confirmButtonText: 'Get MetaMask',
        confirmButtonColor: '#3f51b5',
        footer: '<a href="https://metamask.io/download.html" target="_blank">Click here to download MetaMask</a>'
      });
    } else {
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
        className='!mb-10'
        style={{ marginBottom: '20px', backgroundColor: '#3f51b5' }}
      >
        Create Campaign
      </Button>
      <Grid container spacing={4}>
        {campaigns.length > 0 ? (
          <Grid container spacing={4}>
            {campaigns.map((address, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <OutlinedCard item={address} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper 
          elevation={3} 
          sx={{ 
            padding: 4, 
            textAlign: 'center', 
            borderRadius: 2, 
            backgroundColor: '#f5f5f5',
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" color="textSecondary" gutterBottom>
            It seems there are no campaigns available at the moment.
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Please ensure you have MetaMask installed in your browser to access the campaigns.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="https://metamask.io/download.html"
            target="_blank"
            sx={{
              marginTop: '1rem',
              padding: '0.5rem 1.5rem',
              borderRadius: '25px',
              fontWeight: 'bold',
            }}
          >
            Get MetaMask
          </Button>
        </Paper>
        )}
      </Grid>
      {openCreateForm && <CreateCampaign isOpen={openCreateCampaignForm} account={account} />}
    </Container>
  );
}
