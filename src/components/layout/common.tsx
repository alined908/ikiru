import _ from 'lodash';
import {useEffect, useRef, useState, MutableRefObject} from 'react';
import styled from 'styled-components';
import { chooseRandomSakura, Sakura } from '../../sections/FAQSection';
import VanillaTilt from 'vanilla-tilt';
import { Link } from 'react-router-dom';

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  background: black;
`

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  background: rgb(243,245,240);
  color: black;
`

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
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
    justify-content: center;
    align-items: center;
    width: 100%;
`

const HeaderText = styled.h1`
    display: inline;
    margin-bottom: 2rem;
    padding: 0 2rem;
    font-size: 2.7rem;
    text-align: center;
`

export const baseContainer = `
    border-radius: .25rem;
`

export const Wrapper = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--light-bg);
    ${baseContainer}
    flex: 1;
`

export const InnerBody = styled.div`
    display: flex;
    flex-direction: column;
    width: var(--body-width);
    margin: 0 auto;
    margin-bottom: 3rem;
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
`

export const AvatarImage = styled.img`
    width: 100%;
    height: 100%;
`

export const Avatar = ({image, width, height, ikiruAvatar} : any) => {

    return (
        <Link to={{pathname: '/create', state: {ikiruAvatar: JSON.stringify(ikiruAvatar)}}}>
            <Tilt options={tiltOptions}>
                <AvatarWrapper width={width} height={height}>
                    <AvatarImage src={`./avatars/${image}.png`}/>
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