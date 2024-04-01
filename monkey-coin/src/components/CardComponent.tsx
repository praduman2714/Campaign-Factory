import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import campaign from '../../../ethereum/campaign';
import ViewCampaign from './dialogs/ViewCampaign';
import { useRouter } from 'next/router';

interface Summary {
  minimumContribution: any;
  balance: any;
  requestLength: any;
  approveCount: any;
  manager: any;
}

interface Props {
  item: string;
}

export default function OutlinedCard({ item }: Props) {
  const [selectedCampaignDetails, setSelectedCampaignDetails] = useState<Summary | undefined>(undefined);
  const [showDetails, setShowDetails] = useState(false);
  console.log(item);
  const router = useRouter();

  const handleShowDetails = async (selectedAddress: string) => {
    
    router.push({
      pathname: 'viewCampaign',
      query: { item: item }
    });
  }

  return (
    <>
      <Box sx={{ minWidth: 275 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Campaign Address
            </Typography>
            <Typography variant="body1" component="div">
              {item}
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={() => handleShowDetails(item)} size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Box>
      {selectedCampaignDetails && <ViewCampaign selectedCampaignDetails={selectedCampaignDetails} showDetails={showDetails} setShowDetails={setShowDetails} />}
    </>

  );
}
