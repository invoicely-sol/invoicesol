"use client";
 
import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { Adapter, WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
// import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
 
// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

// imports here
 
export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets: Adapter[] = []
 
  return (
    <ConnectionProvider endpoint={'https://solana-devnet.g.alchemy.com/v2/yV8uf_2Ss1pPDEVsNL36hiOKqv7ctRH3'}> 
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}