import "./App.css";
import { useMemo, useEffect } from "react";
import * as anchor from "@project-serum/anchor";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet
} from "@solana/wallet-adapter-wallets";

import {
  ConnectionProvider,
  WalletProvider,
  useConnection
} from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styled from 'styled-components';
import TeamSection from "./sections/TeamSection";
import NFTDisplaySection from "./sections/NFTDisplay";
import RaritySection from "./sections/RaritySection";
import MintSection from "./sections/MintSection";
import AboutUsSection from "./sections/AboutUsSection";
import FactorySection from "./sections/FactorySection";
import {Main, Body, InnerBody} from './components/layout/common';
import FAQSection from "./sections/FAQSection";
import RoadMapSection from "./sections/RoadmapSection"
import { BrowserRouter as Router,Switch,Route,Link, useLocation} from "react-router-dom";
import { Sakura } from './sections/FAQSection';
import { throttle } from "lodash";
import SocialMediaComponent from "./components/social/SocialMedia";


const treasury = new anchor.web3.PublicKey(process.env.REACT_APP_TREASURY_ADDRESS!);
const config = new anchor.web3.PublicKey( process.env.REACT_APP_CANDY_MACHINE_CONFIG!);
const candyMachineId = new anchor.web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_ID!);
const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);
const startDateSeed = parseInt(process.env.REACT_APP_CANDY_START_DATE!, 10);
const txTimeout = 30000; // milliseconds (confirm this works for your project)


const Navigation = styled.div`
  display: flex;
  align-items: center;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 2.2rem;
  font-weight: bold;

  &:hover {
    color: pink;
    transition: all .33s ease;
  }
`

const NavigationTabs = styled.div`
  display: flex;
`

const NavigationTab = styled.div`
  display: flex;
  padding: 2rem;
  font-weight: bold;
  font-size: 1.2rem;

  a {

    &:hover {
      color: pink;
      transition: all .33s ease;
    }
  }
`

const LandingWrapper = styled.div`
  display: flex;
  height: 100vh;
`

const CommunityBannerWrapper = styled.div`
  display: flex;
  position: relative;
  background: linear-gradient( rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) ), url('/cherry_blossom.png');
  height: 400px;
  justify-content: center;
  flex-direction: column;
  background-position: bottom;
`

const CommunityCall = styled.h1`
  font-size: 3rem;
  margin-top: 0;
  color: black;
`

const CommunityBannerInner = styled.div`
  max-width: 1000px;
  margin: auto;

  p {
    color: black;
    max-width: 500px;
  }
`

const WrappedHeader = styled.div`
  display: flex;
  background: transparent;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 0;
  justify-content: space-between;
  z-index: 10;
`

const InnerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 70%;
  margin: 0 auto;
  padding: 0 1.5rem;
  align-items: center;
`

const NavActionBar = styled.div`
  display: flex;
  align-items: center;
`

const quickNodeEndpoint = 'https://spring-wispy-firefly.solana-devnet.quiknode.pro/eb692f52d5469705a1a6f6c80f719b2b4dedefe0/';

const Landing = ({children} : any) => {


  return (
    <LandingWrapper>
      <div>
      </div>
    </LandingWrapper>
  )
}

const CommunityBanner = () => {
  return (
    <CommunityBannerWrapper>
      <CommunityBannerInner>
        <CommunityCall>
          Join The Commmunity
        </CommunityCall>
        <p>
            Head over to our discord to join our awesome community. 
            Keep up to date with our announcements and stay in touch with your fellow.
        </p>
        
      </CommunityBannerInner>
      
    </CommunityBannerWrapper>
  )
}

const Header = () => {
  const location = useLocation();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  
  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await connection.getBalance(wallet.publicKey);
        console.log(balance/LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, connection]);

  return (
    <WrappedHeader id="header">
      <InnerHeader>
        <Link to="/">
          <Logo>
            <Sakura src={`./sakura/red_sakura.png`}/>
            Ikiru
          </Logo>
        </Link>
        <Navigation>
          <NavigationTabs>
            <NavigationTab>
              <Link to="/mint">Mint</Link>
            </NavigationTab>
            <NavigationTab>
              <Link to="/display">Display</Link>
            </NavigationTab>
            <NavigationTab>
              <Link to="/rarity">Rarity</Link>
            </NavigationTab>
            <NavigationTab>
              <Link to="/random">Factory</Link>
            </NavigationTab>
          </NavigationTabs>
        </Navigation>
        <NavActionBar>
          <SocialMediaComponent type="discord" link="https://discord.gg/58hBq6hWH2"/>
          <SocialMediaComponent type="twitter" link="https://twitter.com/"/>
          <WalletMultiButton></WalletMultiButton>
        </NavActionBar>
      </InnerHeader>
    </WrappedHeader>
  )
}

const App = () => {
  const endpoint = quickNodeEndpoint;

  const wallets = useMemo(
    () => [
        getPhantomWallet(),
        getSlopeWallet(),
        getSolflareWallet(),
        getSolletWallet({ network })
    ],[]
  );

  console.log()

  function handleScroll() {
    const header = document.getElementById('header');

    if (window.pageYOffset > 0) {
      header?.classList.add("sticky")
    } else {
      header?.classList.remove('sticky');
    }
  }

  const throttledHandler = useMemo(() => throttle(handleScroll, 300), []);

  

  useEffect(() => {  
    window.addEventListener('scroll', throttledHandler);

    return () => {
      window.removeEventListener("scroll", throttledHandler);
    };
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider logo="./pink_sakura.png">
          <Router>
            <Header/>
            <Switch>
              <Route path="/mint">
                <MintSection
                  candyMachineId={candyMachineId}
                  config={config}
                  connection={connection}
                  startDate={startDateSeed}
                  treasury={treasury}
                  txTimeout={txTimeout}
                />
              </Route>
              <Route path="/display">
                <NFTDisplaySection/>
              </Route>
              <Route path="/rarity">
                <RaritySection/>
              </Route>
              <Route path="/random">
                <FactorySection/>
              </Route>  
              <Route path="/">
                <Main>
                  <Landing>
                  </Landing>
                  <CommunityBanner/>
                  <Body>
                    <InnerBody>
                      <AboutUsSection/>
                      <FAQSection/>
                      <RoadMapSection/>
                      <TeamSection/>
                    </InnerBody>
                  </Body>
                </Main>
              </Route>
            </Switch>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
