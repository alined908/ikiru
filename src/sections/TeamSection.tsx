import styled from 'styled-components';
import {Header, Wrapper, Content} from '../components/layout/common';
import SocialMediaComponent from '../components/social/SocialMedia';
import { Avatar } from '../components/layout/common';
import {Gender, Trait, IkiruAvatar, traitsJSON} from '../constants';

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
    justify-items: center;
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
    justify-content: space-between;
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
const daniel = new IkiruAvatar(danielTraits, Gender.Male);
const aaron = new IkiruAvatar(danielTraits, Gender.Male);
const steve = new IkiruAvatar(danielTraits, Gender.Male);

const TeamSection = () => {
    return (
      <Wrapper>
        <Header text="Team"/>
        <Content>
            <Team>
                <MemberWrapper>
                    <Avatar ikiruAvatar={daniel} image="ikura_1"/>
                    <MemberDescription>
                        <InfoRow>
                            <h2>
                                Alined
                            </h2>
                            <SocialMediaComponent type="twitter" link="https://twitter.com/alinedxyz"/>
                        </InfoRow>
                        
                        <div>
                            Lover of Monkes. Classy Thug Bird. Dreaming of quitting web2 to pursue web3.
                        </div>
                    </MemberDescription>
                </MemberWrapper>
                <MemberWrapper>
                    <Avatar ikiruAvatar={aaron} image="ikura_3"/>
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
                    <Avatar ikiruAvatar={steve} image="ikura_2"/>
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
        </Content>
        
        
      </Wrapper>
    )
  }

export default TeamSection