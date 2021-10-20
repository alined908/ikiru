import styled from 'styled-components';
import {Header, Wrapper, Content, InnerWrapper} from '../components/layout/common';
import SocialMediaComponent from '../components/social/SocialMedia';
import { Avatar } from '../components/layout/common';
import {Gender, Trait, KizunaAvatar, traitsJSON} from '../constants';
import FAQSection from './FAQSection';
import RoadMapSection from './RoadmapSection';
import TeamSection from './TeamSection';

const InfoSectionWrapper = styled.div`
    margin-top: 8rem;
`

const InfoSection = () => {
    return (
        <InfoSectionWrapper>
            <Content>
                <FAQSection/>
                <RoadMapSection/>
                <TeamSection/>
            </Content>
        </InfoSectionWrapper>
    )
  }

export default InfoSection