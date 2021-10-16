import {Header, Wrapper, Content, InnerWrapper} from '../components/layout/common';
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
    question: `What will be done with the funds?`,
    answer: `
      <div>We believe NFTs empower creators and participants of all types (game devs, gamers, artists, musicians, etc). </div>
      <div>We also believe Solana is currently the best Layer1 to onboard the masses onto Web3.</div>
      <div>The Solana community is great but nascent, and we want to help grow it bigger!</div>
      &nbsp;
      <div>- 10% of mint proceeds and 25% of all royalties will go to a fund to help onboard creators into the Solana ecosystem. </div>
      <div>- 10% of mint proceeds and 25% of all royalties will go to a grants program to help fund projects that enhance the Solana NFT ecosystem. </div>
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
  {
    question: `When will I be able to mint?`,
    answer: `Minting starts ${moment(unixTimestamp).format("MMMM DD, YYYY hh:mm")}`
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
  border-radius: .25rem;

  &:last-of-type{
    margin-bottom: 0;
  }
`

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  font-weight: 600;
  padding: 0 ;
`

const AnswerWrapper = styled.div`
  font-size: 1.1rem;
  padding: 1.25rem 0;
  color: var(--light-text);
`

export const Sakura = styled.img`
  width: 50px;
  height: 50px;
  margin-right: .5rem;
`

const QuestionAnswers = styled.div`
  width: 75%;
`

export const chooseRandomSakura = () => {
  const sakuras = ['pink', 'red'];
  return sakuras[Math.floor(Math.random()*sakuras.length)];
}

const Question = ({question} : any ) => {
  return (
    <QuestionWrapper>
      {question}
    </QuestionWrapper>

  )
}



const FAQSection = () => {
    return (
      <Wrapper>
        <InnerWrapper>
          <Header text="Questions"/>
          <Content>
            <QuestionAnswers>
              {QnAs.map((pair) => 
                <QuestionAnswer data={pair}/>
              )}
            </QuestionAnswers>
          </Content>
        </InnerWrapper>
        
      </Wrapper>
      
    )
  }

export default FAQSection;