import Image from "next/image";
import factory from '../../../ethereum/factory';
import { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import NavBar from "@/components/Navbar";
import OutlinedCard from "@/components/CardComponent";
import { Button } from "@mui/material";
import CreateCampaign from "@/components/dialogs/CreateCampaign";
import web3 from "../../../ethereum/web3";

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [account, setAccount] = useState(null); 

  const openCreateCampaignForm = () => {
    setOpenCreateForm(prevState => !prevState);
  }

  const fetchFromFactory = async () => {
    try {
      const campaigns = await factory.methods.getDeployedCampaigns().call();
      setCampaigns(campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  }

  const getFirstAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchFromFactory();
      await getFirstAccount();
    };
    fetchData();
  }, []);

  return (
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
            onClick={openCreateCampaignForm}
            className="!bg-black !text-white !px-6 !py-2"
          >
            Create Campaign
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-12">
          {campaigns.length > 0 ? campaigns.map((item, index) => (
            <OutlinedCard key={index} item={item} />
          )) : "No items"}
        </div>
      </div>

      {openCreateForm && <CreateCampaign isOpen={openCreateCampaignForm} account={account} />}
    </div>
  );
}
