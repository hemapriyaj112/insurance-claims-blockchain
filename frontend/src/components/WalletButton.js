import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function WalletButton() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const shorten = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "");

  const connectWallet = async () => {
    if (!window.ethereum) {
      const install = window.confirm(
        "No crypto wallet detected. Install MetaMask?"
      );
      if (install) window.open("https://metamask.io/download.html", "_blank");
      return;
    }

    setConnecting(true);
    try {
      // connect provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        const acc = accounts[0];
        setAddress(acc);

        // get balance in ETH
        const bal = await provider.getBalance(acc);
        setBalance(ethers.formatEther(bal));
      }
    } catch (err) {
      console.error("connectWallet error:", err);
      alert("Wallet connection failed: " + (err.message || err));
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(null);
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);

    provider.send("eth_accounts", []).then(async (accounts) => {
      if (accounts.length > 0) {
        const acc = accounts[0];
        setAddress(acc);
        const bal = await provider.getBalance(acc);
        setBalance(ethers.formatEther(bal));
      }
    });

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        const acc = accounts[0];
        setAddress(acc);
        const bal = await provider.getBalance(acc);
        setBalance(ethers.formatEther(bal));
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  return address ? (
    <div className="wallet-info">
      <button className="wallet-btn" title={address}>
        {shorten(address)} ({parseFloat(balance).toFixed(4)} ETH)
      </button>
      <button className="wallet-logout" onClick={disconnectWallet}>
        Disconnect
      </button>
    </div>
  ) : (
    <button className="wallet-btn" onClick={connectWallet} disabled={connecting}>
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
