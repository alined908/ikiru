import {Header, Wrapper, Content} from '../components/layout/common';
import styled from 'styled-components'
import { launchDate, projectTitle } from '../constants';
import moment from 'moment';

const unixTimestamp = new Date(parseInt(process.env.REACT_APP_CANDY_START_DATE!) * 1000)

const QnAs = [
  {
    question: `What is ${projectTitle}?`,
    answer: `We're an NFT community for people who love watching anime.  
      Anyone is welcome to join, but a NFT holder will have access to exclusive community,
      airdrops, and ability to dictate components of the manga and DAO.`
  },
  {
    question: `When will I be able to mint?`,
    answer: `Minting starts ${moment(unixTimestamp).format("MMMM DD, YYYY hh:mm")}`
  },
  {
    question: `How many can I mint?`,
    answer: `1 per transaction, but as many ${projectTitle} as you would like`
  },
  {
    question: `What will be done with the funds?`,
    answer: `
      <div>We believe NFTs empower creators and participants of all types (game devs, gamers, artists, musicians, etc). </div>
      <div>We also believe Solana is currently the best Layer1 to onboard the masses onto Web3.</div>
      <div>The Solana community is great but nascent, and we want to help grow it bigger!</div>
      &nbsp;
      <div>- 10% of mint proceeds and 25% of all royalties will go to a fund to help onboard creators into the Solana ecosystem. </div>
      <div>- 10% of mint proceeds and 25% of all royalties will go to a grants program to help fund projects that enhance the Solana NFT ecosystem. </div>
      &nbsp;
      <div>We have ideas on both fronts, but we also want the community to join us in dictating how to best direct the funds!</div>
    `
  },
  {
    question: "Why should I mint?",
    answer: `
      <div>Mint only if you like the art! </div>
      &nbsp;
      <div>This NFT has zero intrinsic monetary value, and the team has no reign over secondary market pricing speculation. </div>
      &nbsp;
      <div>Adjacently, if you want to help people go full time web3/art, and help those people help other people onboard onto Solana then join us on our mission! </div>
    `
  },
  {
    question: "Who are we?",
    answer: `
      <div>
        Hi! We're friends who have been captivated by the Solana ecosystem
      </div>
      &nbsp;
      <div>
        We want to give back to this vibrant ecosystem with quality art, funding and supporting quality projects, 
        and providing community for anime lovers and more! 
      </div>
    `
  },
]




const QuestionAnswer = ({data} : any) => {
  return (
    <QuestionAnswerWrapper>
      <Question question={data.question} />
      <Answer answer={data.answer}/>
    </QuestionAnswerWrapper>
  )
}

const Answer = ({answer} : any) => {
  return (
    <AnswerWrapper dangerouslySetInnerHTML={{__html: answer}}/>
  )
}

const QuestionAnswerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  border: var(--border);
  background: white;
  box-shadow: var(--shadow-m);
  border-radius: .25rem;

  &:last-of-type{
    margin-bottom: 0;
  }
`

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  font-weight: bold;
  padding: .5rem 1rem ;
  border-bottom: var(--border);
  cursor: pointer;
`

const AnswerWrapper = styled.div`
  padding: 1.25rem 1.25rem;
`

export const Sakura = styled.img`
  width: 50px;
  height: 50px;
  margin-right: .5rem;
`

const QuestionAnswers = styled.div`
  width: 75%;
  margin: 0 auto;
`

export const chooseRandomSakura = () => {
  const sakuras = ['pink', 'black', 'red'];
  return sakuras[Math.floor(Math.random()*sakuras.length)];
}

const Question = ({question} : any ) => {
  return (
    <QuestionWrapper>
      <Sakura src={`./sakura/${chooseRandomSakura()}_sakura.png`}/>
      {question}
    </QuestionWrapper>

  )
}

const FAQSection = () => {
    return (
      <Wrapper>
        <Header text="FAQ"/>
        <Content>
          <QuestionAnswers>
            {QnAs.map((pair) => 
              <QuestionAnswer data={pair}/>
            )}
          </QuestionAnswers>
        </Content>
      </Wrapper>
      
    )
  }

export default FAQSection;