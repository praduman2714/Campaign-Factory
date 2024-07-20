import * as React from 'react';
import NavBar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import { useRouter } from "next/router";
import campaign from '../../../../ethereum/campaign';
import { useEffect, useState } from "react";
import CardsContainer from '@/components/CardContainer';
import { Box, Button } from '@mui/material';
import ContributeForm from '@/components/dialogs/ContributeForm';

interface Summary {
    minimumContribution: any;
    balance: any;
    requestLength: any;
    approveCount: any;
    manager: any;
    campaignAddress: string;
}

const ViewCampaignPage = () => {
    const [selectedCampaignDetails , setSelectedCampaignDetails] = useState<Summary>({ // Initialize as an empty object
        minimumContribution: '',
        balance: '',
        requestLength: '',
        approveCount: '',
        manager: '',
        campaignAddress:''
    });
    const [contribute , setContribute] = useState(false);
    const router = useRouter();
    const { item } = router.query;
    console.log(item);
    const handleContribute = () =>{
        setContribute(prevState => !prevState);
    }

    const fetchItemDetails = async (item : string) => {
        try {
            const campaignInstance = campaign(item);
    
            const summary = await campaignInstance.methods.getSummary().call();
            
    
            const summaryObject = {
                minimumContribution: summary[0],
                balance: summary[1],
                requestLength: summary[2],
                approveCount: summary[3],
                manager: summary[4],
                campaignAddress: item
            };
    
            setSelectedCampaignDetails(summaryObject);
        } catch (error) {
            console.error('Failed to fetch details from contract:', error);
        }
    };
    
    useEffect(() =>{
        if(item){
            fetchItemDetails(item as string);
        }
    },[item])

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
                            onClick={handleContribute}
                            className="!bg-black !text-white !px-6 !py-2"
                        >
                            Contribute to this campaign
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-12">
                        {/* Include the CardsContainer component here */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
                            <CardsContainer campaignDetails={selectedCampaignDetails}  />
                            <Button variant="contained"  sx={{ alignSelf: 'flex-end' }}>
                                Contribute to this campaign
                            </Button>
                        </Box>
                    </div>
                </div>

            </div>
            {contribute && item && <ContributeForm isOpen={handleContribute} campaignAddress={item as string} />}
        </>
    )
}
export default ViewCampaignPage;
