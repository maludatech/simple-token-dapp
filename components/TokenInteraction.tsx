"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { toast } from "sonner";
import { getContract, getBalance, getConnectedAccount } from "@/utils/ether";
import { useAccount } from "wagmi";

export default function TokenInteraction() {
  const { address: account } = useAccount();
  const [balance, setBalance] = useState<string>("0");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        try {
          setIsLoading(true);
          const balance = await getBalance(account);
          setBalance(balance);
        } catch (error: any) {
          toast.error(`Failed to fetch balance: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchBalance();
  }, [account]);

  const handleTransfer = async () => {
    if (!account || !toAddress || !amount) {
      toast.error("Please fill all fields and connect wallet");
      return;
    }
    setIsLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.transfer(
        toAddress,
        ethers.parseUnits(amount, 18)
      );
      await tx.wait();
      const newBalance = await getBalance(account);
      setBalance(newBalance);
      toast.success(
        `Transferred ${amount} SIMP to ${toAddress.slice(
          0,
          6
        )}...${toAddress.slice(-4)}`
      );
      setToAddress("");
      setAmount("");
    } catch (error: any) {
      toast.error(`Transfer failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBurn = async () => {
    if (!account || !burnAmount) {
      toast.error("Please enter an amount to burn and connect wallet");
      return;
    }
    setIsLoading(true);
    try {
      const contract = await getContract();
      const tx = await contract.burn(ethers.parseUnits(burnAmount, 18));
      await tx.wait();
      const newBalance = await getBalance(account);
      setBalance(newBalance);
      toast.success(`Burned ${burnAmount} SIMP`);
      setBurnAmount("");
    } catch (error: any) {
      toast.error(`Burn failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ConnectButton
            showBalance={false}
            accountStatus="address"
            chainStatus="icon"
            label="Connect Wallet"
          />
          {account && (
            <p className="text-sm text-gray-600">
              Balance: <span className="font-semibold">{balance} SIMP</span>
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>Transfer Tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Recipient Address (0x...)"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            disabled={isLoading || !account}
          />
          <Input
            type="number"
            placeholder="Amount (SIMP)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading || !account}
          />
          <Button
            onClick={handleTransfer}
            disabled={isLoading || !account}
            className="w-full hover:cursor-pointer"
          >
            {isLoading ? "Processing..." : "Transfer"}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>Burn Tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="Amount to Burn (SIMP)"
            value={burnAmount}
            onChange={(e) => setBurnAmount(e.target.value)}
            disabled={isLoading || !account}
          />
          <Button
            onClick={handleBurn}
            disabled={isLoading || !account}
            className="w-full hover:cursor-pointer"
          >
            {isLoading ? "Processing..." : "Burn"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
