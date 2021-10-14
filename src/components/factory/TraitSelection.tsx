import styled from 'styled-components';
import { Gender, ITrait, ITraitType, traitsJSON } from '../../constants';
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

const TraitSelection = ({gender, activeTraitType, activeTrait, imageLayers, clickTrait, onArrowClick, generateRandomTrait} : TraitSelectionProps) => {
    return (
        <TraitScroller>
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
            <ScrollerActions>
                <Arrow direction={-1} onClick={() => onArrowClick(-1)}>
                    {"<"}
                </Arrow>
                <RainbowButton onClick={generateRandomTrait}>
                    Random {traitsJSON[activeTraitType].name}
                </RainbowButton>
                <Arrow direction={1} onClick={() => onArrowClick(1)}>
                    {">"}
                </Arrow>
            </ScrollerActions>
        </TraitScroller>
    )
}

export default TraitSelection;

const TraitScroller = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 3rem;
    width: 800px;
    padding: 2.5rem;
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