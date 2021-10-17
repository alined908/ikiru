import "./App.css";
import { useMemo, useEffect, useState, useRef } from "react";
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
import ConnectSection from "./sections/ConnectSection";
import {Main, Body, InnerBody, ExternalButton} from './components/layout/common';
import FAQSection, { chooseRandomSakura } from "./sections/FAQSection";
import RoadMapSection from "./sections/RoadmapSection"
import { BrowserRouter as Router,Switch,Route,Link, useLocation} from "react-router-dom";
import { Sakura } from './sections/FAQSection';
import SocialMediaComponent from "./components/social/SocialMedia";
import { AnimateSharedLayout, motion } from "framer-motion";
import { Gender, KizunaAvatar } from "./constants";
import { random } from "lodash";

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
  padding: 1.5rem;
  font-weight: 800;
  font-size: 1.2rem;
  align-items: center;
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
  background-image: linear-gradient(rgba(142, 158, 171, 0.2), rgba(66, 134, 244, 0.1)), url('/traits/unisex/backgrounds/sakura_green.png');
  height: 400px;
  justify-content: center;
  flex-direction: column;
  background-position: top;
  z-index: 10;
  background-size: cover;
  border-top: 3px solid black;
  box-shadow: var(--shadow-l);
  border-bottom: 3px solid black
`

const CommunityCall = styled.h1`
  font-size: 3rem;
  margin-top: 0;
  color: rgba(0, 0, 0, .9);
`

const CommunityBannerInner = styled.div`

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
  padding: 1.5rem 0;
  justify-content: space-between;
  z-index: 10;
  
  a {
    color: ${props => props.isHome ? 'white' : 'black'};
    &:hover {
      transition: all .33s ease;
      color: pink;
    }

    div {
      fill:  ${props => props.isHome ? 'white' : 'black'};

      &:hover {
        transition: all .33s ease;
        fill: pink;
      }
    }
  }
`

const InnerHeader = styled.div<WrappedHeaderProps>`
  display: flex;
  margin: 0 auto;
  padding: 0 1.5rem;
  align-items: center;
  background: ${props => props.isHome ? 'rgba(30, 30, 30, .7)' : 'transparent'};
  border-radius: .7rem;
  box-shadow: ${props => props.isHome ? 'var(--shadow-s)' : ''} ;
`

const NavActionBar = styled.div`
  display: flex;
  align-items: center;
`

const LandingSplash = styled.div`
  display: flex;
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
  const redirectToDiscord = () => {
    console.log('hello')
    
  }

  return (
    <CommunityBannerWrapper id="banner">
      <CommunityBannerInner>
        <CommunityCall>
          Kizuna
        </CommunityCall>
        <ExternalButton href="https://discord.gg/UeRDFmRU" background="black"  target="_blank" rel="noopener noreferrer">
          Join Discord
        </ExternalButton>
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
      <InnerHeader isHome={location.pathname === '/'}>
        <Navigation>
          <NavigationTabs>
            <NavigationTab>
              <NavLink to="/create">Create</NavLink>
            </NavigationTab>
            <NavigationTab>
              <NavLink to="/mint">Mint</NavLink>
            </NavigationTab>
            <NavigationTab>
              <Link to="/">
                <Logo>
                  <Sakura src={`./sakura/red_sakura.png`}/>
                  Kizuna
                </Logo>
              </Link>
            </NavigationTab>
            <NavigationTab>
              <NavLink to="/display">Display</NavLink>
            </NavigationTab>
            <NavigationTab>
              <NavLink to="/connect">Connect</NavLink>
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

const WrappedSakura = styled(Sakura)`

`

const Flowers = styled.div`
  display: flex;
  margin-top: -5rem;
  opacity: .7;
`
 
const BodyComponent = () => {
  const [isLoaded, setisLoaded] = useState(false);
  const numFlowers = 50;
  const bodyRef = useRef(null);
  

  useEffect(() => {
    setisLoaded(true);
  })

  const renderFlowers = () => {
    let flowersInMotion = [];
    let bodyStart = window.innerHeight;
    let bodyWidth = (bodyRef.current! as HTMLElement).clientWidth;
    console.log(bodyStart)

    for (let i = 0; i < numFlowers; i++) {
      let slowFlower = (
        <motion.div animate={{y: bodyStart + 100, rotate: [0, 360]}} transition={{type: 'tween', duration: 20, ease: "easeInOut", repeat: Infinity, delay: random(0, 20) }}>
          <WrappedSakura src={`./sakura/${chooseRandomSakura()}_sakura.png`}/>
        </motion.div>
      )
      flowersInMotion.push(slowFlower)
    }
    return flowersInMotion;
  }

  return (
    <Body ref={bodyRef}>
      <Flowers>
        <AnimateSharedLayout>
        {isLoaded && renderFlowers().map((flower) => flower)}
        </AnimateSharedLayout>
        
      </Flowers>
      <InnerBody>
        <AboutUsSection/>
        <FAQSection/>
        <RoadMapSection/>
        <TeamSection/>
      </InnerBody>
    </Body>
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
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider logo="./sakura/pink_sakura.png">
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
                <NFTDisplaySection />
              </Route>
              <Route path="/create">
                <FactorySection />
              </Route>
              <Route path="/connect">
                <ConnectSection />
              </Route>
              <Route path="/">
                <Main>
                  <Landing/>
                  <CommunityBanner/>
                  <BodyComponent/>
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
