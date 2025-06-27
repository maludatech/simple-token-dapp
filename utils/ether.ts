import { ethers } from "ethers";
import { ABI, contractAddress } from "@/lib/contract";

export const getContract = async () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask is not installed");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, ABI, signer);
};

export const connectWallet = async (): Promise<string | null> => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask is not installed");
  }
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts[0] || null;
};

export const getBalance = async (address: string): Promise<string> => {
  const contract = await getContract();
  const balance = await contract.balanceOf(address);
  return ethers.formatUnits(balance, 18);
};
