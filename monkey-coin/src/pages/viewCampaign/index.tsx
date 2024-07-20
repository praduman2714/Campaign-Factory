import * as React from 'react';
import { useRouter } from "next/router";
import campaign from '../../../../ethereum/campaign';
import { useEffect, useState } from "react";
import CardsContainer from '@/components/CardContainer';
import { Box, Button, Container, Typography } from '@mui/material';
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
	const [selectedCampaignDetails, setSelectedCampaignDetails] = useState<Summary>({
		minimumContribution: '',
		balance: '',
		requestLength: '',
		approveCount: '',
		manager: '',
		campaignAddress: ''
	});
	const [contribute, setContribute] = useState(false);
	const router = useRouter();
	const { item } = router.query;

	const handleContribute = () => {
		setContribute(prevState => !prevState);
	}

	const fetchItemDetails = async (item: string) => {
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

	useEffect(() => {
		if (item) {
			fetchItemDetails(item as string);
		}
	}, [item]);

	return (
		<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Campaign Details
			</Typography>

			<Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
				<Button
					onClick={handleContribute}
					variant="contained"
					className='!bg-blue-400 !hover:bg-700'
				>
					Contribute to this Campaign
				</Button>
			</Box>

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					px: 2,
					py: 4,
					maxWidth: '100%',
					minHeight: '100vh',
					backgroundColor: '#f0f0f0', // Lighter background for contrast
					borderRadius: 2,
					boxShadow: 3,
					overflow: 'hidden', // Prevent scrolling within the container
				}}
			>
				<CardsContainer campaignDetails={selectedCampaignDetails} />
			</Box>




			{contribute && item && <ContributeForm isOpen={handleContribute} campaignAddress={item as string} />}
		</Container>
	);
}

export default ViewCampaignPage;
