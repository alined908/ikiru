import styled from 'styled-components';
import { Gender, ITrait, ITraitType, traitsJSON, Rarity, rarityColor } from '../../constants';
import Carousel from 'react-spring-3d-carousel';
import Trait from '../../components/factory/Trait';
import { RainbowButton } from '../../sections/MintSection';
import {config} from 'react-spring';

interface TraitSelectionProps {
    activeTraitType: number,
    activeTrait: number,
    imageLayers: (ITrait | null)[]
    gender: Gender
    clickTrait: (position: number) => void
    onArrowClick: (direction: number) => void,
    generateRandomTrait: () => void
}

const RarityLegendWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: .25rem 0;
`

const RarityTitle = styled.div`
    color: var(--light-text);
    font-weight: 600;
    margin-bottom: .25rem;
`

const RarityType = styled.div`
    
    padding: .25rem .5rem;
`

const RarityColor = styled.div<{color: string}>`
    width: 100%;
    height: 20px;
    background: ${props => props.color}
`

const RarityLegend = () => {
    return (    
        <RarityLegendWrapper>
            {Object.keys(Rarity).filter(key => isNaN(Number(key)) === false).map((rarity) => 
                <RarityType>
                    <RarityTitle>
                        {Rarity[parseInt(rarity)]}
                    </RarityTitle>
                    <RarityColor color={rarityColor[parseInt(rarity)]}/>
                </RarityType>
            )}
        </RarityLegendWrapper>
    )
}

const TraitSelection = ({gender, activeTraitType, activeTrait, imageLayers, clickTrait, onArrowClick, generateRandomTrait} : TraitSelectionProps) => {
    return (
        <TraitScroller>
            {/* <RarityLegend/> */}
            <Carousel 
                slides={
                    traitsJSON[activeTraitType].traits
                        .filter(trait => trait.gender === gender || trait.gender === Gender.Unisex)
                        .map((trait : ITrait, index) => {
                            return {
                                key: trait.name + trait.gender.toString(),
                                content: (
                                    <Trait
                                        position={index}
                                        handleClick={clickTrait}
                                        active={trait.path === imageLayers[activeTraitType]?.path} 
                                        traitType={traitsJSON[activeTraitType]} 
                                        trait={trait} 
                                    />
                                )
                            }
                    })
                } 
                goToSlide={activeTrait}
                offsetRadius={2} 
                showNavigation={false}   
                animationConfig={config.gentle}
            /> 
            {/* <ScrollerActions>
                <Arrow direction={-1} onClick={() => onArrowClick(-1)}>
                    {"<"}
                </Arrow>
                <RainbowButton onClick={generateRandomTrait}>
                    Random {traitsJSON[activeTraitType].name}
                </RainbowButton>
                <Arrow direction={1} onClick={() => onArrowClick(1)}>
                    {">"}
                </Arrow>
            </ScrollerActions> */}
        </TraitScroller>
    )
}

export default TraitSelection;

const TraitScroller = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 6rem;
    width: 800px;
`

const ScrollerActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    position: relative;
    bottom: 15%;
    z-index: 3;
`

interface ArrowProps {
    direction: number
}

const Arrow = styled.div<ArrowProps>`
    margin: 0 2rem;
    font-size: 2.5rem;
    cursor: pointer;
    transition: all .25s ease;

    &:hover {
        transform: scale(1.2) translateX(${props => props.direction * 4}px);
        color: var(--black-hover);
    }
`