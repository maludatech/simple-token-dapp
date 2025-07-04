import { ethers } from "ethers";
import { ABI, contractAddress } from "@/lib/contract";
import { getPublicClient, getWalletClient } from "@wagmi/core";
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

export const getBalance = async (address: `0x${string}`): Promise<string> => {
  const publicClient = getPublicClient(config);
  try {
    const balance = await publicClient.readContract({
      address: contractAddress,
      abi: ABI,
      functionName: "balanceOf",
      args: [address],
    });
    console.log("Raw balanceOf result:", balance, "for address:", address);
    return ethers.formatUnits(balance as bigint, 18);
  } catch (error: any) {
    console.error("getBalance error:", error);
    throw new Error(`Failed to fetch balance: ${error.message}`);
  }
};

// Debug function to test raw contract call
export const debugBalance = async (address: `0x${string}`) => {
  const publicClient = getPublicClient(config);
  try {
    const functionSelector = ethers.id("balanceOf(address)").slice(0, 10);
    const paddedAddress = ethers.zeroPadValue(address, 32).slice(2);
    const data = `${functionSelector}${paddedAddress}` as `0x${string}`;
    const result = await publicClient.call({
      to: contractAddress,
      data,
    });
    console.log("Raw balanceOf call result:", result, "for address:", address);
    return result;
  } catch (error: any) {
    console.error("debugBalance error:", error);
    return null;
  }
};
