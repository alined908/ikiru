import styled from 'styled-components';
import {Header, Wrapper, Content, InnerWrapper} from '../components/layout/common';
import SocialMediaComponent from '../components/social/SocialMedia';
import { Avatar } from '../components/layout/common';
import { s3Link, deviceSizes, constructAvatarFromGenderAndTrait, sampleKizunaAvatars} from '../constants';
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
    grid-column-gap: 2rem;
    justify-items: center;

    @media ${deviceSizes.laptop} {
        grid-template-columns: 100%;
        min-width: 0;
    }
`

const MemberWrapper = styled.div`
    display: flex;
    flex-direction: column;
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

const TeamSection = () => {
    return (
        <div>
            <Header text="Team"/>
            <Content>
                <Team>
                    <MemberWrapper>
                        <Avatar kizunaAvatar={sampleKizunaAvatars[0]} image={`${s3Link}avatars/kizuna_1.png`}/>
                        <MemberDescription>
                            <InfoRow>
                                <h2>
                                    Alined
                                </h2>
                                <SocialMediaComponent type="twitter" link="https://twitter.com/alinedxyz"/>
                            </InfoRow>
                            
                            <MemberStory>
                                Monke, Thugbird. Solana native
                            </MemberStory>
                        </MemberDescription>
                    </MemberWrapper>
                    <MemberWrapper>
                        <Avatar kizunaAvatar={sampleKizunaAvatars[1]} image={`${s3Link}avatars/kizuna_2.png`}/>
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