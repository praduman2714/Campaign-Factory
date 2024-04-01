import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props{
    selectedCampaignDetails : Object,
    showDetails: boolean,
    setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ViewCampaign({selectedCampaignDetails , showDetails, setShowDetails} : Props) {

  const [open, setOpen] = React.useState(showDetails);
  console.log("In the dialogue", open , showDetails);
  console.log(selectedCampaignDetails);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShowDetails(prevState => !prevState);
  };

  return (
    <React.Fragment>
     
      <Dialog
        open={showDetails}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
