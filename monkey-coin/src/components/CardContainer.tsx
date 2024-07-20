import * as React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import web3 from '../../../ethereum/web3';

interface CampaignDetails {
  manager: string;
  minimumContribution: number;
  balance: number;
  requestLength: number;
  approveCount: number;
  campaignAddress: string;
}

interface CardProps {
  label: string;
  description: string;
  value: string | number;
  campaignAddress: string;
}

const CardComponent: React.FC<CardProps> = ({ label, description, value, campaignAddress }) => {
  const router = useRouter();

  const handleViewRequest = () => {
    router.push({
      pathname: '/viewCampaign/request',
      query: { item: campaignAddress },
    });
  };

  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: 3, p: 3, maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {description}
        </Typography>
        {label === 'Request Length' && (
          <Button
            onClick={handleViewRequest}
            variant="contained"
            color="primary"
            className='!bg-blue-400 !hover:bg-600'
            sx={{ mt: 2, borderRadius: 1 }}
          >
            View Requests
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const CardsContainer: React.FC<{ campaignDetails: CampaignDetails }> = ({ campaignDetails }) => {
  const { manager, minimumContribution, balance, requestLength, approveCount, campaignAddress } = campaignDetails;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <CardComponent
        label="Manager Address"
        description="The manager created this campaign and can create a request to withdraw money."
        value={manager}
        campaignAddress={campaignAddress}
      />
      <CardComponent
        label="Minimum Contribution (in Wei)"
        description="You must contribute at least this much wei to participate in this campaign and become an approver."
        value={minimumContribution.toString()}
        campaignAddress={campaignAddress}
      />
      <CardComponent
        label="Balance (in Wei)"
        description="The balance is how much this campaign has left to spend."
        value={web3.utils.fromWei(balance, 'wei')}
        campaignAddress={campaignAddress}
      />
      <CardComponent
        label="Request Length"
        description="A request tries to withdraw money from the contract. Requests must be approved by the approvers."
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
