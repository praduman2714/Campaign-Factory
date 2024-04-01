import Web3 from "web3";
require('dotenv').config();
 
/** @type {any} */
let web3;

 
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    // "https://rinkeby.infura.io/v3/15c1d32581894b88a92d8d9e519e476c"
    // process.env.deployedProvider
    "https://earpc.apothem.network/1ec0e5596f411c38c7cc8cca293ef1a6bc6e6f72"
  );
  web3 = new Web3(provider);
}
 
export default web3;
