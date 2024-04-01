import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';
import nProgress from 'nprogress';
import { useRouter } from 'next/router';

interface Props {
  isOpen: () => void;
  campaignAddress: string | undefined;
}

export default function ContributeForm({ isOpen, campaignAddress }: Props) {
  const [open, setOpen] = React.useState(true);
  const [error, setError] = React.useState('');
  console.log("In the contribute form ", campaignAddress);
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    isOpen();
  };

  const getFirstAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    if (accounts.length > 0) {
      return accounts[0];
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    nProgress.start();
    const campaignInstance = Campaign(campaignAddress);
    try {
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries((formData as any).entries());
      const contributionAmount = formJson.minContri;
      const account = await getFirstAccount();
      console.log("account ", account);
      const gasPrice = await web3.eth.getGasPrice();
      console.log("gasPrice ", gasPrice);
      const contributeToCampaign = await campaignInstance.methods.contribute()
        .send({
          from: account,
          value: contributionAmount,
          gas: '3000000',  // Adjust gas limit here
          gasPrice 
        });

      console.log('Campaign created:', contributeToCampaign);
      router.reload();
      handleClose();
    } catch (error) {
      console.log('Error creating campaign:', error);
      setError('Network error: Failed to create campaign. Please try again later.');
      handleClose();
    } finally {
      nProgress.done();
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit
        }}
      >
        <DialogTitle>Contribute to Campaign</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Amount to contribute in this campaign to become approver.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="minContri"
            name="minContri"
            label="Minimum contribution in wei"
            type="number"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Dialog>
      {error && <p>{error}</p>}
    </React.Fragment>
  );
}
