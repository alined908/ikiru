import styled from 'styled-components';
import {Header, Wrapper, Content, InnerWrapper} from '../components/layout/common';
import SocialMediaComponent from '../components/social/SocialMedia';
import { Avatar } from '../components/layout/common';
import {Gender, Trait, KizunaAvatar, traitsJSON} from '../constants';

const Description = styled.div`
    display: flex;
    margin: 3rem 0;
    font-size: 1.5rem;
`

const Team = styled.div`
    display: grid;
    width: 90%;
    min-width: 1000px;
    grid-template-columns: 50% 50%;
    grid-row-gap: 3rem;
`

const MemberWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 380px;
`

const MemberDescription = styled.div`
    padding: .25rem .5rem;

`

const InfoRow = styled.div`
    display: flex;
    align-items: center;
`

const MemberStory = styled.div`
    color: var(--light-text);
`

//Todo - Remap words -> posiiton

const danielTraits : Trait[] = [
    traitsJSON[0].traits[0], 
    traitsJSON[1].traits[0],
    traitsJSON[2].traits[1],
    traitsJSON[3].traits[2],
    traitsJSON[4].traits[1],
    traitsJSON[5].traits[3],
    traitsJSON[6].traits[2],
    traitsJSON[7].traits[0],
    traitsJSON[8].traits[2]
] 
const aaronTraits: Trait[] = []
const steveTraits: Trait[] = []
const daniel = new KizunaAvatar(danielTraits, Gender.Male);
const aaron = new KizunaAvatar(danielTraits, Gender.Male);
const steve = new KizunaAvatar(danielTraits, Gender.Male);

const TeamSection = () => {
    return (
      <Wrapper>
        <InnerWrapper>
            <Header text="Team"/>
            <Content>
                <Team>
                    <MemberWrapper>
                        <Avatar kizunaAvatar={daniel} image={`./avatars/ikura_1.png`}/>
                        <MemberDescription>
                            <InfoRow>
                                <h2>
                                    Alined
                                </h2>
                                <SocialMediaComponent type="twitter" link="https://twitter.com/alinedxyz"/>
                            </InfoRow>
                            
                            <MemberStory>
                                Lover of Monkes. Classy Thug Bird. Quit web2 to pursue web3.
                            </MemberStory>
                        </MemberDescription>
                    </MemberWrapper>
                    <MemberWrapper>
                        <Avatar kizunaAvatar={aaron} image={`./avatars/ikura_3.png`}/>
                        <MemberDescription>
                            <h2>
                                ABaron
                            </h2>
                            <MemberStory>
                                Aspiring artist trying to go full time. 
                            </MemberStory>
                        </MemberDescription>
                    </MemberWrapper>
                    <MemberWrapper>
                        <Avatar kizunaAvatar={steve} image={`./avatars/ikura_2.png`}/>
                        <MemberDescription>
                            <h2>
                                Steve
                            </h2>
                            <MemberStory>
                                Purveyor of anime.
                            </MemberStory>
                        </MemberDescription>
                    </MemberWrapper>
                </Team>
            </Content>
        </InnerWrapper>        
      </Wrapper>
    )
  }

export default TeamSection