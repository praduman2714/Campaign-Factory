import { Box, Button, Typography, Container } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Campaign from "../../../../ethereum/campaign";
import RequestedTable from "@/components/RequestTable";
import CreateRequest from "@/components/dialogs/CreateRequest";

interface Request {
  description: string;
  value: number;
  recipient: string;
  complete: boolean;
  approvalCount: number;
  approvals: number;
  approverCount: number;
}

const RequestCampaignPage = () => {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [allRequest, setAllRequest] = useState<Request[]>([]);

  const router = useRouter();
  const { item } = router.query;

  const getInitialValues = async () => {
    const campaignInstance = Campaign(item); // Assuming `item` is defined somewhere
    const requestCount = await campaignInstance.methods.getRequestCount().call();
    
    const approverCount = await campaignInstance.methods.approversCount().call();
    
    const indices = Array.from(Array(parseInt(requestCount , 10)).keys());
    const allRequest = await Promise.all(
        indices.map(async index => {
            return await campaignInstance.methods.requests(index).call();
        })
    );

    const requestsWithApproverCount = allRequest.map(request => ({
        ...request,
        approverCount
    }));

    setAllRequest(requestsWithApproverCount);
  };

  useEffect(() => {
    if (item) {
      getInitialValues();
    }
  }, [item]);

  const handleCreateNewRequest = () => {
    setOpenCreateForm(true);
  };

  const closeCreateRequestForm = () => {
    setOpenCreateForm(prevState => !prevState);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          mb: 4,
        }}
      >
        <Button
          onClick={handleCreateNewRequest}
          variant="contained"
          className="!bg-blue-500 !hover:bg-blue-700"
          sx={{ borderRadius: 2, px: 4, py: 2 }}
        >
          Create New Request
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Requests
        </Typography>
        <RequestedTable allRequest={allRequest} />
      </Box>

      {openCreateForm && (
        <CreateRequest open={openCreateForm} onClose={closeCreateRequestForm} campaignAddress={item as string} />
      )}
    </Container>
  );
};

export default RequestCampaignPage;
