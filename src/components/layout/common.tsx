import _ from 'lodash';
import {useEffect, useRef, useState, MutableRefObject} from 'react';
import styled from 'styled-components';
import { metaplexAttribute } from '../../sections/NFTDisplay';
import VanillaTilt from 'vanilla-tilt';
import { Link } from 'react-router-dom';
import { useSpring, config, animated } from 'react-spring';
import { ButtonProps } from '../../sections/MintSection';
import { TextEncoder } from 'util';
import { MintButton } from '../../sections/MintSection';

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

export const ExternalButton = styled.a<ButtonProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size:  ${props => {
    if (props.size === 'small') {
        return '1rem'
    } else {
        return '1.2rem'
    }
    }};
    font-weight: 700;
    color: ${props => props.color ?? "white"};
    font-family: 'Rubik', sans-serif;

    outline: none;
    border-radius: .5rem;
    min-width: ${props => {
    if (props.size === 'small') {
        return '100px'
    } else {
        return '169px'
    }
    }};
    min-height: ${props => {
    if (props.size === 'small') {
        return '45px'
    } else {
        return '60px'
    }
    }};
    max-height: 60px;
    border: none;
    background: ${props => props.background};
    transition: all .33s ease;

    &:hover {
    box-shadow: var(--shadow-l);
    transform: scale(1.05);
    background: var(--black-hover);
    }

    &:disabled {
    background: grey;
    cursor: default;
    box-shadow: none;
    }

    &:disabled:hover {
    transform: none;
    }
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
    background: transparent;
    flex: 1;
    width: 100%;
    
`

export const InnerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 3rem auto 0 auto;
    align-items: center;
    justify-content: center;
    width: var(--body-width);
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

export const NumberAnimated = ({newTarget} : any) => {

    const { number } = useSpring({
      reset: true,
    //   reverse: false,
      from: { number: 0 },
      to: { number: newTarget},
      number: 1,
      delay: 200,
      config: config.molasses,
    //   onRest: () => set(!flip),
    })
  
    return <animated.div>{number.to(n => n.toFixed(2))}</animated.div>
}

export interface AvatarWrapperProps {
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