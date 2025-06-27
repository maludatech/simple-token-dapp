import { ethers } from "ethers";
import { ABI, contractAddress } from "@/lib/contract";
import { getAccount, getWalletClient } from "@wagmi/core";
import { config } from "@/config";

export const getContract = async () => {
  const walletClient = await getWalletClient(config);
  if (!walletClient) {
    throw new Error("No wallet connected");
  }
  const provider = new ethers.BrowserProvider(walletClient.transport);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, ABI, signer);
};

export const getBalance = async (address: string): Promise<string> => {
  const contract = await getContract();
  const balance = await contract.balanceOf(address);
  return ethers.formatUnits(balance, 18);
};

export const getConnectedAccount = () => {
  const { address } = getAccount(config);
  return address || null;
};
