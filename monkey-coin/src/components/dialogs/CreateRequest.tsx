import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import nProgress from 'nprogress';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';



interface FormData {
  description: string;
  recipient: string;
  value: string;
  others: string;
}

interface DialogFormProps {
  open: boolean;
  onClose: () => void;
  campaignAddress: string | undefined
}

const CreateRequest: React.FC<DialogFormProps> = ({ open, onClose, campaignAddress }) => {
  const [formData, setFormData] = useState<FormData>({
    description: '',
    recipient: '',
    value: '',
    others: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getFirstAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    if (accounts.length > 0) {
      return accounts[1];
    }
  }

  const handleSubmit = async () => {
    // Handle form submission here
    console.log(formData);
    nProgress.start();
    console.log(campaignAddress);
    const campaignInstance = Campaign(campaignAddress);
    console.log(campaignInstance);
    const { description, recipient, value } = formData;
    try {
      const account = await getFirstAccount();
      const gasPrice = await web3.eth.getGasPrice();
      const createRequest = await campaignInstance.methods.createRequest(description, value, recipient)
        .send({
          from: account,
          gas: '3000000',
          gasPrice
        })
      console.log(createRequest);
      
    } catch (error) {
      console.log(error);
    } finally {
      nProgress.done();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Transaction</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="description"
          name="description"
          label="Description"
          fullWidth
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="recipient"
          name="recipient"
          label="Recipient"
          fullWidth
          value={formData.recipient}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="value"
          name="value"
          label="Value in Wei"
          fullWidth
          type="number"
          value={formData.value}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          id="others"
          name="others"
          label="Others"
          fullWidth
          value={formData.others}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRequest;
