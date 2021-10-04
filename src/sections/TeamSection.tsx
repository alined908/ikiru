import styled from 'styled-components';
import {Header, Wrapper} from '../components/layout/common';
import SocialMediaComponent from '../components/SocialMedia';

const Description = styled.div`
    display: flex;
    margin: 3rem 0;
    font-size: 1.5rem;
`

const Team = styled.div`
    display: grid;
    grid-template-columns: 50% 50%;
    justify-items: center;
    grid-row-gap: 3rem;
`

const MemberWrapper = styled.div`

    display: flex;
    flex-direction: column;
    width: 420px;
`

const MemberImageWrapper = styled.div`
    display: flex;
    box-shadow: var(--shadow-large);
    border-radius: 3rem;
    width: 420px;
    height: 420px;
`

const MemberImage = styled.img`
    width: 420px;
    height: 420px;
`

const MemberDescription = styled.div`
   
`

const TeamSection = () => {
    return (
      <Wrapper>
        <Header>Team</Header>
        <Description>
            Hi! We're two friends who have been captivated by the Solana ecosystem. Our goal is to give back to this vibrant ecosystem with quality art, 
            funding and supporting quality projects, and providing community for anime lovers and more!
        </Description>
        <Team>
            <MemberWrapper>
                <MemberImageWrapper>
                    <MemberImage src="./dude.png"/>
                </MemberImageWrapper>
                <MemberDescription>
                    <h2>
                        Alined
                    </h2>
                    <div>
                        Lover of Monkes. Classy Thug Bird. Dreaming of quitting web2 to pursue web3.
                    </div>
                </MemberDescription>
            </MemberWrapper>
            <MemberWrapper>
                <MemberImageWrapper>
                    <MemberImage src="./girl.png"/>
                </MemberImageWrapper>
                <MemberDescription>
                    <h2>
                        ABaron
                    </h2>
                    <div>
                        Aspiring artist trying to go full time. 
                    </div>
                </MemberDescription>
            </MemberWrapper>
            <MemberWrapper>
                <MemberImageWrapper>
                    <MemberImage src="./dude.png"/>
                </MemberImageWrapper>
                <MemberDescription>
                    <h2>
                        Steve
                    </h2>
                    <div>
                        Purveyor of anime.
                    </div>
                </MemberDescription>
            </MemberWrapper>
        </Team>
        
      </Wrapper>
    )
  }

export default TeamSection