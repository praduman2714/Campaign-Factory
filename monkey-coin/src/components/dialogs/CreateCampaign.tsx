import * as React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import factory from '../../../../ethereum/factory';
import web3 from '../../../../ethereum/web3';
import nProgress from 'nprogress';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
require('dotenv').config();

interface Props {
  isOpen: () => void;
  account: string | null;
}

export default function CreateCampaign({ isOpen, account }: Props) {
  const [open, setOpen] = React.useState(true);
  const [error, setError] = React.useState('');
  const router = useRouter();
  const exploreUrl = 'https://scan.test.btcs.network';
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
      const gasPrice = await web3.eth.getGasPrice();
      const deployedCampaign = await factory.methods.createCampaign(minContri).send({
        from: account,
        gas: '3000000',
        gasPrice
      });
      const transactionHash = deployedCampaign?.transactionHash;
			const etherscanUrl = `${exploreUrl}/tx/${transactionHash}`;

      Swal.fire({
        title: 'Campaign Created',
				html: `You have successfully created a Campaign .<br/><a href="${etherscanUrl}" target="_blank" rel="noopener noreferrer">View Transaction</a>`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3f51b5',
      }).then(() => {
        router.reload();
        handleClose();
      });
  
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Network error: Failed to create campaign. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3f51b5',
      });

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
        <DialogTitle>Create Campaign</DialogTitle>
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
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button type="submit" color="primary">Create</Button>
        </DialogActions>
      </Dialog>
      {error && <Typography color="error" align="center">{error}</Typography>}
    </React.Fragment>
  );
}
