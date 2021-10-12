import {useState} from 'react';
import {Wrapper, Header, Content} from '../components/layout/common';
import styled from 'styled-components';
import { Sakura, chooseRandomSakura } from './FAQSection';
import { useSpring, a } from '@react-spring/web';

const WrappedRoadmap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 4rem 0;
    width: 100%;
`

const WrappedTarget = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    align-items: center;
    padding: 1rem 0;
`

const Number = styled.div`
    font-size: 5rem;
`

const Goal = styled.div`
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
`

const FlipBox = styled.div`
    display: flex;
    align-items: center;
    width: 200px;
    height: 200px;
    justify-content: center;
    margin: 0 4rem;
`

const TargetGoal = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
`

interface Goal {
    number: number,
    goal: string,
    description: string
}

interface TargetProps {
    number: number,
    goal: string,
    description: string,
    numSakura: number
}

const goals : Goal[] = [
    {number: 0, goal: "DAO", description: 'The beginning of the IkiruDAO. Percentage of initial sales and royalties will be directed to enhancing the Solana ecosystem.'},
    {number: 50, goal: "Short", description: 'Producing a nice sketch'},
    {number: 100, goal: "Manga", description: 'Producing a full blown manga'}
]

const Target = ({number, goal, description, numSakura} : TargetProps) => {
    const [flipped, set] = useState(false);

    const { transform, opacity } = useSpring({
        opacity: flipped ? 1 : 0,
        transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
        config: { mass: 5, tension: 500, friction: 80 },
    })

    return (
        <FlipBox onClick={() => set(state => !state)}>
            <a.div className="flipper" style={{ opacity: 1, transform }}>
                <WrappedTarget>
                    {[...Array(numSakura)].map(() => <Sakura src={`./sakura/red_sakura.png`}/> )}
                </WrappedTarget>
            </a.div>
            <a.div className="flipper" style={{opacity, transform,rotateX: '180deg',}}>
                <WrappedTarget>
                    <TargetGoal>
                        <Goal>{goal}</Goal>
                        {description}
                    </TargetGoal>
                </WrappedTarget>
            </a.div>
        </FlipBox>
    )
}

const RoadMapSection = () => {
    return (
        <Wrapper>
            <Header text="Roadmap"/>
            <Content>
                <WrappedRoadmap>
                    {[0, 1, 2].map((num) => 
                        <Target {...goals[num]} numSakura={num + 1}/>)
                    }
                </WrappedRoadmap>
            </Content>
        </Wrapper>
    )
}

export default RoadMapSection