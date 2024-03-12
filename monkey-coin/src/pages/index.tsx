import CustomizedTables from "@/components/CustomeTable";
import Image from "next/image";
import factory from '../../../ethereum/factory'
import { useEffect } from "react";

export default function Home() {

  const fetchFromFactory = async()=>{
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    console.log("campaigns ", campaigns);
  }

  useEffect(() =>{
     fetchFromFactory();
  },[]);

  return (
    <>
      <div className="flex justify-center items-center flex-col h-[100vh]">
        Hello there this is monkey-coin app on building.

        <div className="flex justify-center items-center flex-col w-[70%]">
          <CustomizedTables />
        </div>
      </div>
    </>
  );
}
