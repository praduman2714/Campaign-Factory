import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import web3 from '../../../ethereum/web3';
import { useRouter } from 'next/router';
import Campaign from '../../../ethereum/campaign';
import nProgress from 'nprogress';
import Swal from 'sweetalert2';


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
	const exploreUrl = 'https://scan.test.btcs.network'

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
			console.log("In line 45 ", account, index);
			const gasPrice = await web3.eth.getGasPrice();
			const approveRequest = await campaignInstance.methods.finalizeRequest(index)
				.send({
					from: account,
					gas: '30000000',
					gasPrice: gasPrice
				})
			console.log(approveRequest);
			const txHash = approveRequest.transactionHash;
			const tx = `${exploreUrl}/tx/${txHash}`;
			Swal.fire({
				icon: 'success',
				title: 'Success!',
				html: `The request has been finalized The receiver has received the payment in there wallet address.<br/><a href="${tx}" target="_blank" rel="noopener noreferrer">View Transaction</a>`,
				confirmButtonColor: "green",
				confirmButtonText: "OK",
				willClose: () => {
					window.location.reload();
				}
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'info',
				title: 'Oops...',
				text: 'Something went wrong! Please try again later. This action can only be performed by the manager.',
				confirmButtonColor: "#f15928",
				confirmButtonText: "Try Again !",
			});
		} finally {
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
			const transactionHash = approveRequest?.transactionHash;
			const etherscanUrl = `${exploreUrl}/tx/${transactionHash}`;

			Swal.fire({
				icon: 'success',
				title: 'Success!',
				html: `The request has been approved.<br/><a href="${etherscanUrl}" target="_blank" rel="noopener noreferrer">View Transaction</a>`,
				confirmButtonColor: "green",
				confirmButtonText: "OK",
				willClose: () => {
					window.location.reload();
				}
			});

		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong! Please try again later. Or you might have already approved this request.',
				confirmButtonColor: "#f15928",
				confirmButtonText: "Try Again !",
			});
		} finally {
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
						<TableCell>Amount (in Wei)</TableCell>
						<TableCell>Recipient Address</TableCell>
						<TableCell>Approval Count</TableCell>
						<TableCell>Approve</TableCell>
						<TableCell>Finalize</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{allRequest.map((request, index) => (
						<TableRow key={index}>
							<TableCell>{index + 1}</TableCell>
							<TableCell>{request.description}</TableCell>
							<TableCell>{web3.utils.fromWei(request.value, 'wei')}</TableCell>
							<TableCell>{request.recipient}</TableCell>
							<TableCell>{request.approvalCount.toString()} / {request.approverCount.toString()}</TableCell>
							<TableCell>
								{!request.complete ? (
									<Button className='!text-white bg-green-500 hover:bg-green-900' onClick={() => handleApprove(index)}>
										Approve
									</Button>
								) : (
									<Typography variant="body2" color="text.secondary">
										Request Approved
									</Typography>
								)}
							</TableCell>
							<TableCell>
								{!request.complete ? (
									<Button className='!text-white bg-orange-500 hover:bg-orange-900' onClick={() => handleFinalise(index)}>
										Finalize
									</Button>
								) : (
									<Typography variant="body2" color="text.secondary">
										Request Finalized
									</Typography>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default RequestedTable;
