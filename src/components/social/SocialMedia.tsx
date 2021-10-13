import styled from "styled-components"
import { ReactComponent as Twitter} from './twitter.svg';
import { ReactComponent as Discord} from './discord.svg';
import { useHover } from "../layout/common";

interface SocialMediaProps {
    type: string
    link: string
}

const SocialMediaWrapper = styled.div`
    display: flex;
    width: 36px;
    height: 36px;
    justify-content: center;
    align-items: center;
    padding: .25rem;
    margin-right: 1rem;

    path {
        transition: fill .33s ease;
    }
`

const SocialMediaComponent = ({type, link} : SocialMediaProps) => {

    const [hoverRef, isHovered] = useHover<HTMLDivElement>();

    const determineType = (type: string) => {
        if (type === 'discord') {
            return <Discord fill={isHovered ? "pink" : "inherit"} width={24} height={24}/>
        } else if (type === 'twitter') {
            return <Twitter fill={isHovered ? "pink" : "inherit"} width={24} height={24}/>
        }
    }

    return (
        <a target="_blank" href={link}>
            <SocialMediaWrapper ref={hoverRef}>
                {determineType(type)}
            </SocialMediaWrapper>
        </a>
        
    ) 
}

export default SocialMediaComponent