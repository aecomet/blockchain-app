'use client';

import artifact from '@/abi/MyToken.sol/MyToken.json';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Home() {
  const [windowEthereum, setWindowEthereum] = useState();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { ethereum } = window as never;
      setWindowEthereum(ethereum);
    }
  }, []);

  const handleButtonClick = async () => {
    if (windowEthereum) {
      const provider = new ethers.BrowserProvider(windowEthereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, artifact.abi, provider);

      const walletAddress: string = await signer.getAddress();
      const balance = await contract.balanceOf(walletAddress);

      setInputValue(balance.toString());
    }
  };

  return (
    <div>
      <h1>Blockchain sample app</h1>
      <button onClick={handleButtonClick}>Tokens owned</button>

      <input type="text" value={inputValue} readOnly />
    </div>
  )
}