import {Wrapper, Header, Content, InnerWrapper} from '../components/layout/common';
import styled from 'styled-components';

const WrappedRoadmap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 1rem;
`


const TargetGoal = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
`

const Description = styled.div`
    font-size: 1.1rem;
    color: var(--light-text);
`

interface Goal {
    number: number,
    goal: string,
    description: string
}

const goals : Goal[] = [
    {
        number: 0, 
        goal: "KizunaDAO", 
        description: `<div>The beginning of the KizunaDAO. </div>

        &nbsp;
        <div>- Percentage of initial sales and royalties will be directed to enhancing the Solana ecosystem. </div>
        <div>-  Active governance of funds will take place with NFT Holders able to have input on how best to direct the funds. </div>
        <div>- A multisig wallet with signers from trusted members of the community and DAO will be set up. </div>
        &nbsp;
        <div>We have ideas on both fronts, but we also want the community to join us in dictating how to best direct the funds!</div>`
    },{
        number: 100, 
        goal: "Merchandise", 
        description: `Stuff you'd want to wear. NFTs with kizuna will have special perks.`
    },
    {
        number: 100, 
        goal: "Manga", 
        description: `<div>Join us as we develop our world and our story. There's a good chance your characters might appear.</div>
        `
    },
    {
        number: 50, 
        goal: "Metaverse", 
        description: `<div>Expanding ways to represent your onchain kizuna.</div>`
    },
    
]

const RoadMapSection = () => {
    return (
        <Wrapper>
            <InnerWrapper>
                <Header text="Roadmap"/>
                <Content>
                    <WrappedRoadmap>
                        {[0, 1, 2, 3].map((num) => 
                            <WrappedTarget>
                                <TargetGoal>
                                    <Goal>{goals[num].goal}</Goal>
                                    <Description dangerouslySetInnerHTML={{__html: goals[num].description}}></Description>
                                </TargetGoal>
                            </WrappedTarget>
                        )}
                    </WrappedRoadmap>
                </Content>
            </InnerWrapper>
        </Wrapper>
    )
}

export default RoadMapSection