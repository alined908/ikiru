import {Wrapper, Content} from '../components/layout/common';
import {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import { Avatar } from '../components/layout/common';
import { Gender, Rarity } from '../constants';
import { ITrait, ITraitType, traitsJSON } from '../constants';
import {sample, random} from 'lodash';
import { saveAs } from 'file-saver';
import { MintButton as Button, RainbowButton } from './MintSection';
import domtoimage from 'dom-to-image';
import Carousel from 'react-spring-3d-carousel';
import {config} from 'react-spring';
import {Tilt, tiltOptions} from '../components/layout/common';

const TraitSection = styled.div`
    display: flex;
`

interface TraitTypeProps {
    active: boolean
}

const TraitType = styled.div<TraitTypeProps>`
    display: flex;
    align-items: center;
    padding: 1rem;
    border: var(--border);
    box-shadow: var(--shadow-s);
    margin: .5rem 0;
    border-radius: .5rem;
    background: white;
    cursor: pointer;
    transition: all .3s ease;

    :last-of-type {
        margin-bottom: 0;
    }

    ${({ active }) => active && `
        box-shadow: var(--shadow-m);
        background: rgb(230,245, 238);
    `}

    &:hover {
        box-shadow: var(--shadow-m);
        background: rgb(230,245, 238);
    }
`

const TraitTypes = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 2rem;
`

const TraitImage = styled.img`
    width: 100%;
    height: 100%;
`

const BuildABear = styled.div`
    display: flex;
    width: 450px;
    height: 450px;
    box-shadow: var(--shadow-xl);
`

interface LayerProps {
    layer: number
}

const Layer = styled.img<LayerProps>`
    z-index: ${props => props.layer};
    position: absolute;
    width: 450px;
    height: 450px;
`

interface TraitProps {
    traitType: ITraitType
    trait: ITrait
    active: boolean
    position: number
    handleClick: (position: number) => void
}

const rarityColor = {
    [Rarity.Common]: '0 .5rem 1rem rgba(0,0, 0, .15)',
    [Rarity.Rare]: '0 .5rem 1rem rgba(8, 112, 184, 0.5);',
    [Rarity.Epic]: '0 .5rem 1rem rgba(59, 43, 91, 0.5);',
    [Rarity.Legendary] : '0 .5rem 1rem rgba(244, 208, 63, .5)'
}

interface TraitWrapperProps {
    rarity: Rarity
    active: boolean
}

const TraitWrapper = styled.div<TraitWrapperProps>`
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
    border-radius: .5rem;
    transition: all .25s ease;
    cursor: pointer;
    box-shadow: ${props => rarityColor[props.rarity]};
`

const TraitImageWrapper = styled.div`
    border-top-right-radius: .5rem;
    border-top-left-radius: .5rem;
    width: 320px;
    height: 320px;
    overflow: hidden;
`

const TraitDescription = styled.div`
    display: flex;
    justify-content: space-between;
    padding: .75rem 1rem;
    background: black;
    color: rgb(250, 250, 250, .97);
    border-bottom-right-radius: .5rem;
    border-bottom-left-radius: .5rem;
    overflow: hidden;
    
`

const TraitAttribute = styled.div`
    font-size: .9rem;
`


const TraitAttributeValue = styled.div`
    font-weight: 600;
    font-size: .9rem;
`


const Trait = ({traitType: {layer}, trait, active, position, handleClick} : TraitProps) => {

    const genderMapping = {
        [Gender.Unisex]: '♂️♀️',
        [Gender.Male]: '♂️',
        [Gender.Female]: '♀️'
    }

    const manageClick = () => {
        handleClick(position);
    }

    return (
        <TraitWrapper active={active} rarity={trait.rarity_threshold} onClick={manageClick}>
            <TraitImageWrapper>
                <TraitImage src={trait.path}/>
            </TraitImageWrapper>
            <TraitDescription>
                <TraitAttribute>
                    <TraitAttributeValue>
                        {trait.name}
                    </TraitAttributeValue>
                    
                </TraitAttribute> 
                <TraitAttributeValue>
                    {genderMapping[trait.gender]}
                    {trait.probability}%
                </TraitAttributeValue>
                    
                    
            </TraitDescription>
        </TraitWrapper>
    )
}

const FactoryWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 19%;
`

const TraitTypeTitle = styled.h2`
    font-size: 1.3rem;
    margin: 0;
    margin-bottom: .1rem;
`

const TraitTitle = styled.div`
    font-size: .85rem;
`

const TraitTypePreview = styled.img`
    width: 50px;
    height: 50px;
    margin-right: 1rem;
`

const SkeletonTraitTypePreview = styled.div`


    width: 50px;
    height: 50px;
    margin-right: 1rem;
    display: inline-block;
    position: relative;
    overflow: hidden;
    background-color: #DDDBDD;
    
    &:after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        background: linear-gradient(
            90deg,
            rgba(#fff, 0) 0,
            rgba(#fff, 0.2) 20%,
            rgba(#fff, 0.5) 60%,
            rgba(#fff, 0)
        );
        animation: shimmer 2s infinite;
        content: '';
    }
    
    @keyframes shimmer {
        100% {
        transform: translateX(100%);
        }
    }
      
`

const DisplayActions = styled.div`
    display: flex;
    margin-top: 1.5rem;
    justify-content: space-evenly;
`

const TraitScroller = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 3rem;
    width: 750px;
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

interface TraitTypesSectionProps {
    imageLayers: (ITrait | null)[] 
    activeTraitType: number
    clickTraitType: (index : number) => void
}

const TraitTypesSection = ({imageLayers, activeTraitType, clickTraitType} : TraitTypesSectionProps) => {
    return (
        <TraitTypes>
            {traitsJSON.map((traitType: ITraitType, index: number) => 
                <TraitType 
                    key={traitType.layer} 
                    onClick={() => clickTraitType(index)} 
                    active={activeTraitType === index}
                >
                    {(imageLayers[index] === null || imageLayers[index]?.name === "None") ?
                        <SkeletonTraitTypePreview/>
                        :
                        <TraitTypePreview src={imageLayers[index]?.path} />
                    }
                    
                    <div>
                        <TraitTypeTitle>
                            {traitType.name}
                        </TraitTypeTitle>
                        <TraitTitle>
                            {imageLayers[index] === null ? "Select" : imageLayers[index]?.name}
                        </TraitTitle>
                    </div>
                    
                </TraitType>
            )}
        </TraitTypes>
    )
}

const DisplaySection = styled.div`
`

interface DisplayProps {
    imageLayers : (ITrait | null)[]
    generateRandomAvatar: () => void
    clearCanvas: () => void
}

const Display = ({imageLayers, generateRandomAvatar, clearCanvas} : DisplayProps) => {
    return (
        <DisplaySection>
            <Tilt options={tiltOptions}>
                <BuildABear>
                    {(imageLayers).map((trait: ITrait | null, index: number) => {
                        console.log('this is happening alot/ usememo');
                        if (trait) {
                            return <Layer layer={index} src={trait.path}/>
                        } 
                    })}
                </BuildABear>
            </Tilt>
            
            <DisplayActions>
                <RainbowButton onClick={generateRandomAvatar}>
                    Random Avatar
                </RainbowButton>
                <Button size="small" background="black" onClick={clearCanvas}>
                    Clear
                </Button>
            </DisplayActions>
        </DisplaySection>
    )
}

interface TraitSelectionProps {
    activeTraitType: number,
    activeTrait: number,
    imageLayers: (ITrait | null)[]
    clickTrait: (position: number) => void
    onArrowClick: (direction: number) => void,
    generateRandomTrait: () => void
}

const TraitSelection = ({activeTraitType, activeTrait, imageLayers, clickTrait, onArrowClick, generateRandomTrait} : TraitSelectionProps) => {
    return (
        <TraitScroller>
            <Carousel 
                slides={
                    traitsJSON[activeTraitType].traits.map((trait : ITrait, index) => {
                        return {
                            key: trait.name + trait.gender.toString(),
                            content: <Trait
                                position={index}
                                handleClick={clickTrait}
                                active={trait.path === imageLayers[activeTraitType]?.path} 
                                traitType={traitsJSON[activeTraitType]} 
                                trait={trait} 
                            />
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

const calculateNewIndex = (direction: number, currIndex: number, array: any[]) => {
    console.log(direction, currIndex, array);
    if (array.length === 1) {
        return 0;
    }

    const lastPossIndex = array.length - 1;
    let newIndex = direction + currIndex;
    
    return newIndex < 0 ? lastPossIndex : (newIndex > lastPossIndex) ?  0 : newIndex
}

const FactorySection = () => {    
    const initializedLayers = new Array(9).fill(null);
    const [imageLayers, setImageLayers] = useState<(ITrait | null)[]>([...initializedLayers]);
    const [activeTraitType, setActiveTraitType] = useState<number>(0);
    const [activeTrait, setActiveTrait] = useState<number>(0); 

    const onKeyup = (event: KeyboardEvent) => {
        console.log(event.keyCode);
        if (event.keyCode === 37) {
            console.log('left')
            onArrowClick(-1)
        } else if (event.keyCode === 39) {
            console.log('right');
            onArrowClick(1)
        } else if (event.keyCode === 38) {
            onTraitTypeClick(-1)
        } else if (event.keyCode === 40) {
            onTraitTypeClick(1)
        } 
    }

    useEffect(() => {
        //Handle Keypress for TraitType + Trait
        window.addEventListener('keyup', onKeyup);
        return () => window.removeEventListener('keyup', onKeyup);
    }, [onKeyup])

    useEffect(() => {
        let imageLayersCopy = [...imageLayers];
        imageLayersCopy[activeTraitType] = traitsJSON[activeTraitType].traits[activeTrait];
        setImageLayers(imageLayersCopy);
    }, [activeTrait])

    useEffect(() => {
        setActiveTrait(
            imageLayers[activeTraitType] === null ? 
            0 : traitsJSON[activeTraitType].traits.findIndex((ele) => ele.name + ele.gender.toString() === imageLayers[activeTraitType]!.name + imageLayers[activeTraitType]!.gender.toString()));
    }, [activeTraitType])

    const generateRandomAvatar = () => {
        let randomizedLayers : (ITrait | null)[] = [];
        let activeTrait = 0;

        for(let i = 0; i < traitsJSON.length; i++) {
            let traitType: ITraitType = traitsJSON[i];
            let possibleCandidates : (ITrait | null)[] = [...traitType.traits];
            let randomIndex = random(0, possibleCandidates.length - 1);
            activeTrait = randomIndex;
            let chosen = possibleCandidates[randomIndex] as (null | ITrait);
            randomizedLayers.push(chosen)
        }

        console.log(activeTrait)
        console.log(randomizedLayers);
        setActiveTrait(activeTrait);
        setImageLayers([...randomizedLayers]);
    }

    const clickTrait = (position: number) => {
        setActiveTrait(position);
    }

    const generateRandomTrait = () => {
        const lastPossIndex = traitsJSON[activeTraitType].traits.length - 1;
        let randomIndex = activeTrait;
        while (randomIndex === activeTrait && traitsJSON[activeTraitType].traits.length > 1) {
            randomIndex = random(0, lastPossIndex);
        }
        setActiveTrait(randomIndex);
    }

    const onArrowClick = (direction: number) => {
        setActiveTrait(prevIndex => calculateNewIndex(direction, prevIndex, traitsJSON[activeTraitType].traits));
    }

    const onTraitTypeClick = (direction: number) => {
        setActiveTraitType(prevIndex => calculateNewIndex(direction, prevIndex, traitsJSON));
    }

    const clickTraitType = (layer: number) => {
        setActiveTraitType(layer);
    }

    const clearCanvas = () => {
        setImageLayers([...initializedLayers]);
    }

    return (
        <Wrapper>
            <Content>
                <FactoryWrapper>
                    <TraitSection>
                        <TraitTypesSection 
                            imageLayers={imageLayers} 
                            activeTraitType={activeTraitType} 
                            clickTraitType={clickTraitType}  
                        />
                        <TraitSelection 
                            {...{
                                activeTraitType,
                                activeTrait, 
                                generateRandomTrait, 
                                onArrowClick, 
                                imageLayers, 
                                clickTrait
                            }} 
                        />
                    </TraitSection>
                    <Display 
                        imageLayers={imageLayers} 
                        generateRandomAvatar={generateRandomAvatar} 
                        clearCanvas={clearCanvas}
                    />
                </FactoryWrapper>
            </Content>
        </Wrapper>
    )
}

export default FactorySection