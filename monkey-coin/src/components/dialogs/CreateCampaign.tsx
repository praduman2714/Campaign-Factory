import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import factory from '../../../../ethereum/factory';
import web3 from '../../../../ethereum/web3';
import nProgress from 'nprogress';
import { useRouter } from 'next/router';

interface Props {
  isOpen: () => void;
  account: string | null;
}

export default function CreateCampaign({ isOpen, account }: Props) {
  const [open, setOpen] = React.useState(true);
  const [error, setError] = React.useState('');
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    isOpen();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    nProgress.start();
    try {
      const formData = new FormData(event.currentTarget);
      const formJson = Object.fromEntries((formData as any).entries());
      const minContri = formJson.minContri;
      console.log("minContri" , minContri);
      console.log("account" , account);
      console.log("I guess the campaign is deploying let's see that.");
      const deployedCampaign = await factory.methods.createCampaign(minContri)
        .send({
          from: account,
          gas: '3000000',  // Adjust gas limit here
          gasPrice: '30000000000' // Adjust gas price here
        });

      console.log('Campaign created:', deployedCampaign);
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
        <DialogTitle>Create Campaign Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please specify the minimum contribution amount required for participants to join the Campaign.
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
