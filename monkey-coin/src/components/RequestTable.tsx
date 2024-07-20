import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import web3 from '../../../ethereum/web3';
import { useRouter } from 'next/router';
import Campaign from '../../../ethereum/campaign';
import nProgress from 'nprogress';

interface Request {
	description: string;
	value: number;
	recipient: string;
	complete: boolean;
	approvalCount: number;
	approvals: number;
	approverCount: number
}

interface Props {
	allRequest: Request[];
}

const RequestedTable: React.FC<Props> = ({ allRequest }) => {

	const router = useRouter();
	const { item } = router.query;
	const campaignInstance = Campaign(item);

	const getFirstAccount = async () => {
		const accounts = await web3.eth.getAccounts();
		if (accounts.length > 0) {
			return accounts[0];
		}
	}

	const handleFinalise = async (index: number) => {
		nProgress.start();
		try {
			const account = await getFirstAccount();
			console.log("In line 45 ", account , index);
			const gasPrice = await web3.eth.getGasPrice();
			const approveRequest = await campaignInstance.methods.finalizeRequest(index)
				.send({
					from: account,
					gas: '30000000',
					gasPrice: gasPrice
				})
			console.log(approveRequest);
		} catch (error) {
			console.log(error);
		} finally{
			nProgress.done();
		}
		
	}

	console.log(allRequest);

	const handleApprove = async (index: number) => {
		nProgress.start();
		try {
			const account = await getFirstAccount();
			console.log("In line 45 ", account);
			const gasPrice = await web3.eth.getGasPrice();
			const approveRequest = await campaignInstance.methods.approveRequest(index)
				.send({
					from: account,
					gas: '30000000',
					gasPrice: gasPrice
				})
			console.log(approveRequest);
		} catch (error) {
			console.log(error);
		} finally{
			nProgress.done();
		}
		
	}

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ID</TableCell>
						<TableCell>Description</TableCell>
						<TableCell>Amount (in Ether)</TableCell>
						<TableCell>Recipient Address</TableCell>
						<TableCell>Approval Count</TableCell>
						<TableCell>Approve </TableCell>
						<TableCell>Finalize </TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{allRequest.map((request, index) => (
						<TableRow key={index}>
							<TableCell>{index + 1}</TableCell>
							<TableCell>{request.description}</TableCell>
							<TableCell>{web3.utils.fromWei(request.value, 'ether')}</TableCell>
							<TableCell>{request.recipient}</TableCell>
							<TableCell>{request.approvalCount.toString()} / {request.approverCount.toString()}</TableCell>
							<TableCell>
								<Button className='!text-white bg-green-500 hover:bg-green-900' onClick={() => handleApprove(index)}>
									Approve
								</Button>
							</TableCell>
							<TableCell>
								<Button className='!text-white bg-orange-500 hover:bg-orange-900' onClick={() => handleFinalise(index)}>
									Finalise
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default RequestedTable;
