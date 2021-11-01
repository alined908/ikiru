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
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { animated, useSpring } from "react-spring";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styled from 'styled-components';
import TeamSection from "./sections/TeamSection";
import NFTDisplaySection from "./sections/NFTDisplay";
import MintSection from "./sections/MintSection";
import FactorySection from "./sections/FactorySection";
import ConnectSection from "./sections/ConnectSection";
import {Main, Body, InnerBody, ExternalButton} from './components/layout/common';
import FAQSection, { chooseRandomSakura } from "./sections/FAQSection";
import RoadMapSection from "./sections/RoadmapSection"
import { BrowserRouter as Router,Switch,Route,Link, useLocation} from "react-router-dom";
import { Sakura } from './sections/FAQSection';
import SocialMediaComponent from "./components/social/SocialMedia";
import { AnimateSharedLayout, motion } from "framer-motion";
import { useMediaQuery } from 'react-responsive'
import { deviceSizes, Gender, KizunaAvatar } from "./constants";
import InfoSection from "./sections/InfoSection";
import { random } from "lodash";
import { hasProps } from "@react-spring/core/dist/declarations/src/helpers";
import { AnyFn } from "@react-spring/types";

const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;
const treasury = new anchor.web3.PublicKey(process.env.REACT_APP_TREASURY_ADDRESS!);
const config = new anchor.web3.PublicKey( process.env.REACT_APP_CANDY_MACHINE_CONFIG!);
const candyMachineId = new anchor.web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_ID!);
const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);
const startDateSeed = parseInt(process.env.REACT_APP_CANDY_START_DATE!, 10);
const txTimeout = 30000; // milliseconds (confirm this works for your project)
const quickNodeEndpoint = 'https://spring-wispy-firefly.solana-devnet.quiknode.pro/eb692f52d5469705a1a6f6c80f719b2b4dedefe0/';


const LandingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11;
  height: 100%;
  overflow: hidden;
  overflow-y: hidden;
  position: relative;
`

const LandingCall = styled.div`
  font-size: 2.5rem;
  font-weight: 600;
  margin-top: 3rem;
`

const LandingSplash = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  background-image: url('/backgrounds/cherry_blossom.png');
  filter: blur(5px);
  opacity: .7;
  flex-direction: column;
  align-items: center;
`

interface LandingImageProps {
  avatarPosition: boolean
}

const LandingImage = styled.img<LandingImageProps>`
  position: absolute;
  height:100%;
  width: auto;
  top:0;

  @media (min-width: 1920px) {
    width: 100%;
  }

  @media (max-width: 1920px) {
    height:100%;
  }

  
  left: ${props => props.avatarPosition ? "auto" : "0"};
  right: ${props => !props.avatarPosition ? "auto" : "0"};
  
`

// const LandingImageComponent = ({opacity, avatarPosition} : any) => {
//   return (
//     <LandingImage opacity={opacity} avatarPosition={avatarPosition} src="./backgrounds/landing.png"/>
//   )
// }

// const AnimatedLandingImage = animated(LandingImageComponent)

const Landing = ({children} : any) => {

  const props = useSpring({
    from: { opacity: 0 },
    to: {opacity: 1},
    delay: 700,
    config: { mass: 10, tension: 10, friction: 10, duration: 1000 }
  });

  const generateRandom = () => {
    return Math.random() < 0.5;
  }

  return (
    <LandingWrapper>
      <LandingSplash>
        
     
      </LandingSplash>
      <animated.div style={props}>
          <LandingImage avatarPosition={generateRandom()} src="./backgrounds/landing.png"/>
      </animated.div>
      
    </LandingWrapper>
  )
}

const CommunityBannerWrapper = styled.div`
  display: flex;
  position: relative;
  background-image: url('/backgrounds/cherry_blossom.png');
  height: 300px;
  justify-content: center;
  flex-direction: column;
  background-position: top;
  z-index: 10;
  background-size: cover;
  border-top: 3px solid black;
  box-shadow: var(--shadow-l);
  border-bottom: 3px solid black;
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

const CommunityBanner = () => {
  return (
    <CommunityBannerWrapper id="banner">
      <CommunityBannerInner>
        <ExternalButton href="https://discord.gg/UeRDFmRU" background="black"  target="_blank" rel="noopener noreferrer">
          Join Discord
        </ExternalButton>
      </CommunityBannerInner>
    </CommunityBannerWrapper>
  )
}

interface WrappedHeaderProps {
  isHome : boolean
} 


const WrappedHeader = styled.div<WrappedHeaderProps>`
  display: flex;
  width: 100%;
  margin: 0 auto;
  z-index: 12;

  ${props => !props.isHome ? "" : `position: absolute;
  top: 0;`}
  
  background: transparent;

  & > div {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  
  a {
    color: black;
    &:hover {
      transition: all .33s ease;
      color: pink;
    }

    div {
      fill:  black;

      &:hover {
        transition: all .33s ease;
        fill: pink;
      }
    }
  }  
`

const InnerHeader = styled.div<WrappedHeaderProps>`
  display: flex;
  width: 95%;
  justify-content: space-between;
  padding: 1.75rem 3rem;
  align-items: center;
  background: transparent;
  border-radius: .7rem;

  @media ${deviceSizes.mobile} {
    padding: 1.25rem 1.5rem;  
  }
`

const Navigation = styled.div`
  display: flex;
  align-items: center;
`

const Logo = styled.img`
  display: flex;
  align-items: center;
  height: 70px;

  &:hover {
    color: pink;
    transform: scale(1.1);
    transition: all .33s ease;
  }

  @media ${deviceSizes.laptop} {
    font-size: 2rem;
  }
`

const NavigationTabs = styled.div`
  display: flex;
`

const NavigationTab = styled.div`
  display: flex;
  padding: 1.5rem;
  font-weight: 800;
  font-size: 1.3rem;
  align-items: center;
`

const NavActionBar = styled.div`
  display: flex;
  align-items: center;
`

const NavLink = styled(Link)`
  transition: all .2s ease;

  &:hover {
    transform: scale(1.1);
  }
`

const navigationLinks = [
  {name: "About", path: "/about"},
  {name: "Create", path: "/create"},
  {name: "Mint", path: "/mint"},
  {name: "Connect", path: "/display"}
]

const Header = () => {
  const location = useLocation();
  // const wallet = useWallet();
  const isHome = location.pathname === '/';
  const [displayHeader, setDisplayHeader] = useState(false);
  const headerProps = useSpring({
    opacity: displayHeader ? 1 : 0,
    marginTop: displayHeader ? 0 : -50
  })
  const isMobileNav = useMediaQuery({ query: '(max-width: 1050px)' });
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  
  useEffect(() => {
    if (!displayHeader) {
      setTimeout(() => setDisplayHeader(true), 1000)
    }
  },[])

  return (
    
      <WrappedHeader isHome={isHome}>
        {isMobileNavOpen && <NavigationMobile close={() => setMobileNavOpen(false)} />}
        <animated.div style={headerProps}>
        <InnerHeader isHome={isHome}>
          <Navigation>
            <Link to="/">
              <Logo src="./misc/logo.png"/>
            </Link>
          </Navigation>
          {!isMobileNav ? 
              <NavActionBar>
                <NavigationTabs>
                  {navigationLinks.map((navLink) => 
                  <NavigationTab>
                    <NavLink to={navLink.path}>{navLink.name}</NavLink>
                  </NavigationTab>
                  )}
                </NavigationTabs>
                <SocialMediaComponent type="discord" link="https://discord.gg/58hBq6hWH2"/>
                <SocialMediaComponent type="twitter" link="https://twitter.com/kizunanft"/>
                <WalletMultiButton></WalletMultiButton>
                
              </NavActionBar>
            :
            <Burger onClick={() => setMobileNavOpen(true)}>
              <span/>
              <span/>
              <span/>
            </Burger>     
          }
        </InnerHeader>
        </animated.div>
      </WrappedHeader>
    
  )
}

const WrappedNavMobile = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-color: black;
  z-index: 14;
`

const closeContent = `
  position: absolute;
  left: 15px;
  content: ' ';
  height: 33px;
  width: 4px;
  background-color: white;
`

const CloseButton = styled.div`

  position: absolute;
  right: 2rem;
  top: 1.75rem;
  width: 35px;
  height: 35px;
  cursor: pointer;
  z-index: 15;

  &:before {
    ${closeContent}
    transform: rotate(45deg);
  }

  &:after {
    ${closeContent}
    transform: rotate(-45deg);
  }

  &:hover::before {
    background-color: pink;
  }

  &:hover::after {
    background-color: pink;
  }
`

const Burger = styled.div`
  cursor: pointer;
  span {
      display: block;
      width: 35px;
      height: 5px;
      margin-bottom: 5px;
      position: relative;
      background: black;
      border-radius: 10px;
      z-index: 1;
  }
`

const NavMobileLinks = styled.div`
  padding: 3rem;

  a {
    color: white;
    &:hover {
      transition: all .33s ease;
      color: pink;
    }
  }
`

interface NavigationMobileProps {
  close: () => void
}

const NavigationMobile = ({close} : NavigationMobileProps) => {
  return (
    <WrappedNavMobile>
      <CloseButton onClick={close}/>
      <NavMobileLinks>
        {navigationLinks.map((navLink) => 
          <NavigationTab>
              <NavLink to={navLink.path}>
                <span  onClick={close}>
                 {navLink.name}
                </span>
                
              </NavLink>
          </NavigationTab>
        )}
      </NavMobileLinks>
    </WrappedNavMobile>
  )
}

const WrappedSakura = styled(Sakura)`

`

const Flowers = styled.div`
  display: flex;

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
      {/* <Flowers>
        <AnimateSharedLayout>
          {isLoaded && renderFlowers().map((flower) => flower)}
        </AnimateSharedLayout>
      </Flowers> */}
      <InnerBody>
        
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
      <WalletProvider wallets={wallets}>
        <WalletModalProvider logo="./sakura/pink_sakura.png">
          <Router>
            <Header />
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
              <Route path="/display/:id">
                <div>
                  Something here
                </div>
              </Route>
              <Route path="/display">
                <NFTDisplaySection />
              </Route>
              <Route path="/about">
                <InfoSection/>
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
                  {/* <BodyComponent/> */}
                  {/* <CommunityBanner/> */}
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
