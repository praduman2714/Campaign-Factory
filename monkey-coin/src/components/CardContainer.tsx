import * as React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { useRouter } from 'next/router';

interface CampaignDetails {
  manager: string;
  minimumContribution: number;
  balance: number;
  requestLength: number;
  approveCount: number;
  campaignAddress: string
}

interface CardProps {
  label: string;
  description: string;
  value: string | number;
  campaignAddress: string
}

const CardComponent: React.FC<CardProps> = ({ label, description, value , campaignAddress } ) => {
  const router = useRouter();
  const handleViewRequest = ()=>{
    router.push({
      pathname: 'viewCampaign/request',
      query: { item: campaignAddress }
    });
  }

  return (
    <Card variant="outlined" sx={{ mb: 2, width: 600 }}> {/* Adjust width and height as needed */}
      <CardContent>
        <Typography variant="h5" component="div" sx={{}}> {/* Reduce margin between value and label */}
          {value}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}> {/* Reduce margin between value and label */}
          {label}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {description}
        </Typography>
        {label === "Request Length" && ( 
          <Button 
            onClick={handleViewRequest}
            className='!bg-blue-600 !text-white' sx={{ mt: 2 }}>
            View Requests
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const CardsContainer: React.FC<{ campaignDetails: CampaignDetails }> = ({ campaignDetails }) => {
  const { manager, minimumContribution, balance, requestLength, approveCount,  campaignAddress } = campaignDetails;
  

  const handleContributeClick = () => {
    // Add your logic for contributing to the campaign here
    console.log('Contribute to this campaign clicked');
  };

  return (
    <Box>
      <CardComponent
        label="Manager Address"
        description="The manager created this campaign and can create a request to withdrawal a money."
        value={manager}
        campaignAddress={campaignAddress}
      />
      <CardComponent
        label="Minimum Contribution"
        description="You must contribute at least this much wei to participate in this campaign and become an approver."
        value={minimumContribution.toString()}
        campaignAddress={campaignAddress}
      />
      <CardComponent
        label="Balance"
        description="The balance is how much this campaign has left to spend."
        value={balance.toString()}
        campaignAddress={campaignAddress}
      />
      <CardComponent
        label="Request Length"
        description="A request tries to withdrawals money form the contract. Request must be approve by the approvers."
        value={requestLength.toString()}
        campaignAddress={campaignAddress}
      />
      <CardComponent
        label="Approve Count"
        description="Number of people who have already donated to this campaign and also approved this campaign."
        value={approveCount.toString()}
        campaignAddress={campaignAddress}
      />

    </Box>
  );
};

export default CardsContainer;
