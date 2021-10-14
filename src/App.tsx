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
import MintSection from "./sections/MintSection";
import AboutUsSection from "./sections/AboutUsSection";
import FactorySection from "./sections/FactorySection";
import {Main, Body, InnerBody} from './components/layout/common';
import FAQSection from "./sections/FAQSection";
import RoadMapSection from "./sections/RoadmapSection"
import { BrowserRouter as Router,Switch,Route,Link, useLocation} from "react-router-dom";
import { Sakura } from './sections/FAQSection';
import SocialMediaComponent from "./components/social/SocialMedia";

const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
const treasury = new anchor.web3.PublicKey(process.env.REACT_APP_TREASURY_ADDRESS!);
const config = new anchor.web3.PublicKey( process.env.REACT_APP_CANDY_MACHINE_CONFIG!);
const candyMachineId = new anchor.web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_ID!);
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
  font-weight: 800;

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
  font-weight: 800;
  font-size: 1.5rem;
`

const LandingWrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`

const CommunityBannerWrapper = styled.div`
  display: flex;
  position: relative;
  background-color: white;
  background-image: url('/traits/unisex/backgrounds/sakura_green.png');
  height: 400px;
  justify-content: center;
  flex-direction: column;
  background-position: top;
  background-size: cover;
`

const CommunityCall = styled.h1`
  font-size: 3rem;
  margin-top: 0;
  color: rgba(0, 0, 0, .9);
`

const CommunityBannerInner = styled.div`
  position: absolute;
  left: 30%;
  max-width: 1000px;
  margin: auto;

  p {
    color: black;
    max-width: 500px;
  }
`

interface WrappedHeaderProps {
  isHome : boolean
} 

const WrappedHeader = styled.div<WrappedHeaderProps>`
  display: flex;
  position: absolute;
  top:0;
  width: 100%;
  margin: 0 auto;
  padding: 1rem 0;
  justify-content: space-between;
  z-index: 10;
  

  a {
    
    color: black;
    &:hover {
      transition: all .33s ease;
      color: pink;
    }

    div {
      fill: "black";

      &:hover {
        transition: all .33s ease;
        fill: pink;
      }
    }
  }
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

const LandingSplash = styled.div`
  display: block;
  width: auto;
  height: auto;
  background: wheat;
`

const LandingImage = styled.img`
  height: auto;
`

const NavLink = styled(Link)`
  transition: all .2s ease;

  &:hover {
    transform: scale(1.1);
  }
`

const quickNodeEndpoint = 'https://spring-wispy-firefly.solana-devnet.quiknode.pro/eb692f52d5469705a1a6f6c80f719b2b4dedefe0/';

const Landing = ({children} : any) => {

  return (
    <LandingWrapper>
      <LandingSplash>
        <LandingImage src="./backgrounds/landing.png"/>
      </LandingSplash>
    </LandingWrapper>
  )
}

const CommunityBanner = () => {
  return (
    <CommunityBannerWrapper id="banner">
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

  // function handleScroll() {
  //   const header = document.getElementById('header');

  //   if (window.pageYOffset > 0) {
  //     header?.classList.add("sticky")
  //   } else {
  //     header?.classList.remove('sticky');
  //   }
  // }

  // const throttledHandler = useMemo(() => throttle(handleScroll, 300), []);

  // useEffect(() => {  
  //   window.addEventListener('scroll', throttledHandler);

  //   return () => {
  //     window.removeEventListener("scroll", throttledHandler);
  //   };
  // }, [])

  return (
    <WrappedHeader id="header" isHome={location.pathname === '/'}>
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
              <NavLink to="/random">Create</NavLink>
            </NavigationTab>
            <NavigationTab>
              <NavLink to="/mint">Mint</NavLink>
            </NavigationTab>
            <NavigationTab>
              <NavLink to="/display">Display</NavLink>
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
