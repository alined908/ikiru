import "./App.css";
import { useMemo } from "react";
import * as anchor from "@project-serum/anchor";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { getPhantomWallet, getSolflareWallet, getSolletWallet} from "@solana/wallet-adapter-wallets";
import { ConnectionProvider, WalletProvider, useWallet} from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styled from 'styled-components';
import TeamSection from "./sections/TeamSection";
import NFTDisplaySection from "./sections/NFTDisplay";
import RaritySection from "./sections/RaritySection";
import MintSection from "./sections/MintSection";
import AboutUsSection from "./sections/AboutUsSection";
import {Main, Body} from './components/layout/common';
import FAQSection from "./sections/FAQSection";
import RoadMapSection from "./sections/RoadmapSection";

const treasury = new anchor.web3.PublicKey(process.env.REACT_APP_TREASURY_ADDRESS!);
const config = new anchor.web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_CONFIG!);
const candyMachineId = new anchor.web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_ID!);
const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);
const startDateSeed = parseInt(process.env.REACT_APP_CANDY_START_DATE!, 10);
const txTimeout = 30000; // milliseconds (confirm this works for your project)
const projectTitle = 'Ikiru'

const Header = styled.div`
  display: flex;
  padding: 1.5rem;
  justify-content: space-between;
`

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);
  const wallets = useMemo(() => [getPhantomWallet(), getSolflareWallet(), getSolletWallet()],[]);
  const wallet = useWallet();

  console.log(endpoint);
  console.log(wallet);
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Main>
            {console.log(wallet)}
            <Header>
              {projectTitle}
              <WalletMultiButton>
                {wallet.connected ? wallet.publicKey : "Connect Wallet"}
              </WalletMultiButton>
            </Header>
            <Body>
              {/* <MintSection
                wallet={wallet}
                candyMachineId={candyMachineId}
                config={config}
                connection={connection}
                startDate={startDateSeed}
                treasury={treasury}
                txTimeout={txTimeout}
              /> */}
              <AboutUsSection/>
              <RaritySection/>
              <NFTDisplaySection/>
              <FAQSection/>
              <RoadMapSection/>
              <TeamSection/>
            </Body>
            
          </Main>
          
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
