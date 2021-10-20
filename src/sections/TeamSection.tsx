import styled from 'styled-components';
import {Header, Wrapper, Content, InnerWrapper} from '../components/layout/common';
import SocialMediaComponent from '../components/social/SocialMedia';
import { Avatar } from '../components/layout/common';
import { s3Link } from '../constants';
import {Gender, Trait, KizunaAvatar, traitsJSON, traitTypesMapping} from '../constants';

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
    justify-items: center;
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
    traitTypesMapping['Background'].nameToMaleTraitMapping['Night Sky (Galaxy)'], 
    traitTypesMapping['Skin'].nameToMaleTraitMapping['Pale'],
    traitTypesMapping['Neck'].nameToMaleTraitMapping['Stripes'],
    traitTypesMapping['Clothes'].nameToMaleTraitMapping['Black Striped Yukata'],
    traitTypesMapping['Expression'].nameToMaleTraitMapping['Smile'],
    traitTypesMapping['Earring'].nameToMaleTraitMapping['Cross'],
    traitTypesMapping['Face Accessory'].nameToMaleTraitMapping['None'],
    traitTypesMapping['Hair'].nameToMaleTraitMapping['Parted'],
    traitTypesMapping['Head Accessory'].nameToMaleTraitMapping['Mask']
] 
const aaronTraits: Trait[] = []
const steveTraits: Trait[] = []
const daniel = new KizunaAvatar(danielTraits, Gender.Male);
const aaron = new KizunaAvatar(danielTraits, Gender.Male);
const steve = new KizunaAvatar(danielTraits, Gender.Male);

const TeamSection = () => {
    return (
        <div>
            <Header text="Team"/>
            <Content>
                <Team>
                    <MemberWrapper>
                        <Avatar kizunaAvatar={daniel} image={`${s3Link}avatars/kizuna_1.png`}/>
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
                        <Avatar kizunaAvatar={aaron} image={`${s3Link}avatars/kizuna_3.png`}/>
                        <MemberDescription>
                            <h2>
                                Jam
                            </h2>
                            <MemberStory>
                                Aspiring artist trying to go full time. 
                            </MemberStory>
                        </MemberDescription>
                    </MemberWrapper>
                    {/* <MemberWrapper>
                        <Avatar kizunaAvatar={steve} image={`${s3Link}avatars/kizuna_2.png`}/>
                        <MemberDescription>
                            <h2>
                                Steve
                            </h2>
                            <MemberStory>
                                Purveyor of anime.
                            </MemberStory>
                        </MemberDescription>
                    </MemberWrapper> */}
                </Team>
            </Content>
        </div>
    )
  }

export default TeamSection