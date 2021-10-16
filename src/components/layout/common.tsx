import _ from 'lodash';
import {useEffect, useRef, useState, MutableRefObject} from 'react';
import styled from 'styled-components';
import { metaplexAttribute } from '../../sections/NFTDisplay';
import VanillaTilt from 'vanilla-tilt';
import { Link } from 'react-router-dom';

const MintButton = styled.button`
`

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  background: black;
`

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  color: black;

`

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 3rem 0;
`

interface HeaderProps {
    text: string
}

export const Header = ({text} : HeaderProps) => {
    return (
        <WrappedHeader>
            <HeaderText>
                {text}
            </HeaderText>
        </WrappedHeader>
    )
}

const WrappedHeader = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`

const HeaderText = styled.mark`
    display: inline;
    margin-bottom: 2rem;
    margin: 0;
    font-size: 2.5rem;
    font-weight: 600;
    text-align: center;
    padding: .7rem 1rem;
`

export const Wrapper = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-bottom: 3px solid black;
    background: transparent;
    flex: 1;
    
`

export const InnerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 3rem auto 0 auto;
    align-items: center;
    justify-content: center;
    width: var(--body-width);
    position: relative;
    left: 7.5%;
`

export const InnerBody = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;

    section:last-of-type {
        border-bottom: 0;
    }
`

export const TiltWrapper = styled.div`
    cursor: pointer;
`

export function Tilt(props : any) {
    const { options, ...rest } = props;
    const tilt = useRef(null);
  
    useEffect(() => {
      VanillaTilt.init(tilt.current!, options);
    }, [options]);
  
    return <TiltWrapper ref={tilt} {...rest}>{props.children}</TiltWrapper>;
}

export const tiltOptions = {
    scale: 1.1,
    speed: 1000,
    max: 20,
    perspective: 1800,
    glare: true,
    "max-glare": .4
};

interface AvatarWrapperProps {
    width: number
    height: number
}

export const AvatarWrapper = styled.div<AvatarWrapperProps>`
    display: flex;
    box-shadow: var(--shadow-l);
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    border-radius: .25rem;
`

export const AvatarImage = styled.img`
    width: 100%;
    height: 100%;
`

export const Avatar = ({image, width, height, kizunaAvatar} : any) => {

    return (
        <Link to={{pathname: '/create', state: {kizunaAvatar: JSON.stringify(kizunaAvatar)}}}>
            <Tilt options={tiltOptions}>
                <AvatarWrapper width={width} height={height}>
                    <AvatarImage src={image}/>
                </AvatarWrapper>
            </Tilt>
        </Link>
    )
}

export const DisplayAvatarWrapper = styled.div<AvatarWrapperProps>`
    display: flex;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    border-radius: .25rem;
    max-width: 500px;
`

export const DisplayAvatarTraits = styled.div`
    display: flex;
    flex-wrap: wrap;
    background-color: white;
    max-width: 400px;
    font-size: .8rem;
`

export const DisplayAvatarTrait = styled.div`
    display: flex;
    padding: .5rem;
`

export const DisplayAvatar = ({image, width, height, kizunaAvatar} : any) => {

    // const triggerConnectionChange = () => {
    //     client = Client
    // }   

    return (
        // <Link to={{pathname: '/create', state: {kizunaAvatar: JSON.stringify(kizunaAvatar)}}}>
            // <Tilt options={tiltOptions}>
            <div>
                <DisplayAvatarWrapper width={width} height={height}>
                    <AvatarImage src={image}/>
                </DisplayAvatarWrapper>
                <DisplayAvatarTraits>
                    {kizunaAvatar.arweaveData.attributes.map((attr : metaplexAttribute) => 
                        <DisplayAvatarTrait>
                            {attr.trait_type} - {attr.value}
                        </DisplayAvatarTrait>
                    )}
                </DisplayAvatarTraits>
                {/* <MintButton onClick={triggerConnectionChange}>Hello</MintButton> */}
            </div>
            // </Tilt>
        // </Link>
    )
}


// Hook
// T - could be any type of HTML element like: HTMLDivElement, HTMLParagraphElement and etc.
// hook returns tuple(array) with type [any, boolean]
export function useHover<T>(): [MutableRefObject<T>, boolean] {
    const [value, setValue] = useState<boolean>(false); 
    const ref: any = useRef<T | null>(null);
    const handleMouseOver = (): void => setValue(true);
    const handleMouseOut = (): void => setValue(false);
    useEffect(
        () => {
        const node: any = ref.current;
        if (node) {
            node.addEventListener("mouseover", handleMouseOver);
            node.addEventListener("mouseout", handleMouseOut);
            return () => {
            node.removeEventListener("mouseover", handleMouseOver);
            node.removeEventListener("mouseout", handleMouseOut);
            };
        }
        },
        [ref.current] // Recall only if ref changes
    );
    return [ref, value];
}