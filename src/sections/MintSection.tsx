import { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import { CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useSpring, animated} from 'react-spring';
import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "../candy-machine";
import { Wrapper } from "../components/layout/common";
import useMeasure from "react-use-measure";
import Rotatooor from "../components/Rotatooor";

const CounterText = styled.span``; // add your styles here

interface ButtonProps {
  background?: string
  color?: string
  size?: string
}

export const MintButton = styled.button<ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${props => {
    if (props.size === 'small') {
      return '1rem'
    } else {
      return '1.1rem'
    }
  }};
  cursor: pointer;
  font-size:  ${props => {
    if (props.size === 'small') {
      return '1rem'
    } else {
      return '1.2rem'
    }
  }};
  font-weight: 700;
  color: ${props => props.color ?? "white"};
  font-family: 'Rubik', sans-serif;
  
  outline: none;
  border-radius: .5rem;
  min-width: ${props => {
    if (props.size === 'small') {
      return '100px'
    } else {
      return '169px'
    }
  }};
  min-height: ${props => {
    if (props.size === 'small') {
      return '45px'
    } else {
      return '60px'
    }
  }};
  max-height: 60px;
  border: none;
  background: ${props => props.background};
  transition: all .33s ease;

  &:hover {
    box-shadow: var(--shadow-l);
    transform: scale(1.05);
    background: var(--black-hover);
  }

  &:disabled {
    background: grey;
    cursor: default;
    box-shadow: none;
  }

  &:disabled:hover {
    transform: none;
  }
`;

const RainbowText = styled.div`

   background: linear-gradient(to right, #ef5350, #f48fb1, #7e57c2, #2196f3, #26c6da, #43a047, #eeff41, #f9a825, #ff5722);
   background-size: 200% 200%;
   -webkit-background-clip: text;
   -webkit-text-fill-color: transparent;
   animation: Animation 2.5s ease infinite;
   -webkit-animation: Animation 2.5s ease infinite;

   @keyframes Animation { 
      0%{background-position:10% 0%}
      50%{background-position:91% 100%}
      100%{background-position:10% 0%}
    }
    @-webkit-keyframes Animation {
      0%{background-position:10% 0%}
      50%{background-position:91% 100%}
      100%{background-position:10% 0%}
  }
`

export const RainbowButton = ({onClick, children} : any) => {
  return (
    <MintButton size="small" background="black" onClick={onClick}>
      <RainbowText>
        {children}
      </RainbowText>
    </MintButton>
  )
}

const Directions = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0;
    margin-top: 1.5rem;
    color: red;
  }

 
`

const Tip = styled.div`
  font-size: 1rem !important;
  color: grey;
`

const Steps = styled.div`
  margin-top: 2rem;

  > div {
    margin-left: 2rem;
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
`

const MintInner = styled.div`
    background: white;
    padding: 1rem 2rem 2rem 2rem;
    margin-left: 3rem;
    box-shadow: var(--shadow-m);
`;

const CustomWrapper = styled(Wrapper)`
  
`

const MintButtonContainer = styled.div`
  display: flex;

  > div {
    margin-left: 2rem;
  }

  .MuiCircularProgress-root {
    width: 30px !important;
    height: 30px !important;
    color: black !important;
  }
`

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

const WrappedProgressBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 475px;
  height: 50px;
  background: white;
  border: var(--border);
  border-radius: .5rem;
  margin-bottom: 2rem;
  overflow: hidden;
`

interface ProgressBarProps {
  progress: number
  end: number
}

const ProgressBar = ({progress, end}: ProgressBarProps) => {
  const [ref, {width}] = useMeasure();
  const props = useSpring({ from: { width: 0}, to:{ width: progress/end * width } })

  return (
    <WrappedProgressBar ref={ref}>
      <animated.div className="fill" style={props}/>
      <animated.div className="content">
        {`${progress}/${end}`}
      </animated.div>
    </WrappedProgressBar>
  )
}

const MintWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 30%;
`

const MintSection = (props: HomeProps) => {
  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
  const [isFetchingCMState, setisFetchingCMState] = useState(true);

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const refreshCandyMachineState = () => {
    (async () => {
      if (!wallet) return;

      const {
        candyMachine,
        goLiveDate,
        itemsAvailable,
        itemsRemaining,
        itemsRedeemed,
      } = await getCandyMachineState(
        wallet as anchor.Wallet,
        props.candyMachineId,
        props.connection
      );

      setItemsAvailable(itemsAvailable);
      setItemsRemaining(itemsRemaining);
      setItemsRedeemed(itemsRedeemed);

      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
      setisFetchingCMState(false);
    })();
  };

  const onMint = async () => {
    try {
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
      refreshCandyMachineState();
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
  ]);

  return (
    <CustomWrapper>
      <MintWrapper>
        <Rotatooor/>
        <MintInner>
          <Directions>
            <h1>Mint Steps</h1>
            <Tip>💡 Tip - Use a burner wallet (a wallet specific for this mint) </Tip>
            <Steps>
              <div>
                1. Connect your wallet top right
              </div>
              <div>
                2. Click mint. Approve transaction.
              </div>
              <div>
                3. Check NFT in wallet or in display section.
              </div>
            </Steps>
           
          </Directions>
          
          <ProgressBar progress={itemsRedeemed} end={itemsAvailable}/>

          <MintButtonContainer>
            <MintButton
              background="black" 
              disabled={!wallet || isSoldOut || isMinting || !isActive}
              onClick={onMint}
            > 
              {!wallet ? "Connect to Continue " : isFetchingCMState ? <CircularProgress /> : isSoldOut ? (
                "SOLD OUT"
              ) : isActive ? (
                isMinting ? (
                  <CircularProgress />
                ) : (
                  "MINT"
                )
              ) : (
                <Countdown
                  date={startDate}
                  onMount={({ completed }) => completed && setIsActive(true)}
                  onComplete={() => setIsActive(true)}
                  renderer={renderCounter}
                />
              )}
            </MintButton>
            
            <div>
              {wallet && 
                <h3>
                  Balance: {(balance || 0).toLocaleString()} SOL
                </h3>
              }
            </div>
          </MintButtonContainer>
        </MintInner>
      </MintWrapper>
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </CustomWrapper>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours + (days || 0) * 24} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};

export default MintSection;
