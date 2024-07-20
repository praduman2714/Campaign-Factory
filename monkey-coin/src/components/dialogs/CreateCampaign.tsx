import * as React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
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

      router.reload();
      handleClose();
    } catch (error) {
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
