import NavBar from "@/components/Navbar";
import { Box, Button } from "@mui/material";
import SideBar from "@/components/SideBar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CreateRequest from "@/components/dialogs/CreateRequest";
import Campaign from "../../../../ethereum/campaign";
import RequestedTable from "@/components/RequestTable";

interface Request {
  description: string;
  value: number;
  recipient: string;
  complete: boolean;
  approvalCount: number;
  approvals: number;
  approverCount: number
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
    
    // Generate an array of sequential indices from 0 to requestCount - 1
    const indices = Array.from(Array(requestCount).keys());

    // Fetch all requests using the generated indices
    const allRequest = await Promise.all(
        indices.map(async index => {
            return await campaignInstance.methods.requests(index).call();
        })
    );

    console.log("Requests:", allRequest);

    // Merge approverCount into each request
    const requestsWithApproverCount = allRequest.map(request => ({
        ...request,
        approverCount
    }));

    setAllRequest(requestsWithApproverCount);
};



  useEffect(() => {
    if (item) {
      const allRequest = getInitialValues();
      console.log(allRequest);
    }
  }, [item]);

  const handleCreateNewRequest = () => {
    setOpenCreateForm(true);
  }
  const closeCreateRequestForm = () => {
    setOpenCreateForm(prevState => !prevState);
  }
  return (
    <>
      <div className="flex h-screen">
        {/* Navbar */}
        <div className="fixed top-0 left-0 w-full bg-gray-200 z-10 ml-60">
          <NavBar />
        </div>

        {/* Sidebar */}
        <div className="mt-20 fixed left-0 top-15vh h-screen text-white">
          <SideBar />
        </div>

        {/* Main content */}
        <div className="w-full flex flex-col ml-64 p-8">
          <div className="w-full mt-20 h-15vh flex flex-end justify-end">
            <Button
              onClick={handleCreateNewRequest}
              className="!bg-black !text-white !px-6 !py-2"
            >
              Create new Request
            </Button>
          </div>

          <div className="mt-5">
            {/* Include the CardsContainer component here */}

            <RequestedTable allRequest={allRequest} />

          </div>
        </div>

      </div>
      {openCreateForm && <CreateRequest open={openCreateForm} onClose={closeCreateRequestForm} campaignAddress={item as string} />}
    </>
  )
}
export default RequestCampaignPage;