import {Wrapper, Content} from '../components/layout/common';
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import { Gender, Rarity} from '../constants';
import { ITrait, ITraitType, traitsJSON } from '../constants';
import {random } from 'lodash';
import Display from '../components/factory/Display';
import TraitTypesSection from '../components/factory/TraitTypesSection';
import TraitSelection from '../components/factory/TraitSelection';
import { calculateNewIndex } from '../helpers';
import {motion, AnimateSharedLayout} from 'framer-motion';


class Trait implements ITrait{
    name: string
    probability: number
    rarity_threshold: Rarity
    gender: Gender
    path: string

    constructor({name, probability, rarity_threshold, gender, path} : ITrait) {
        this.name = name;
        this.probability = probability;
        this.rarity_threshold = rarity_threshold;
        this.gender = gender;
        this.path = path;
    }
}

class IkiruAvatar {
    traits: Trait[]

    constructor(traits = []) {
        this.traits = traits;
    }

    addTrait = (trait: Trait) => {
        this.traits.push(trait);
    }

    assignRarityScore = () => {
        //
    }
}

interface FactorySectionProps {
    avatar? : IkiruAvatar
}

const FactorySection = ({avatar} : FactorySectionProps) => {    
   
    //TODO - If avatar exists then merge into state...

    // Keep track of gender state
    const [gender, setGender] = useState<Gender>(Gender.Male);
    //Create array tracking the correct trait at traitType[index] 
    const initializedLayers = new Array(9).fill(null); 
    const [imageLayers, setImageLayers] = useState<(ITrait | null)[]>([...initializedLayers]);
    const [activeTraitType, setActiveTraitType] = useState<number>(0);
    const [activeTrait, setActiveTrait] = useState<number>(0); 

    //Handle Keypress for TraitType + Trait
    const onKeyup = (event: KeyboardEvent) => {
        if (event.keyCode === 37) {
            onArrowClick(-1)
        } else if (event.keyCode === 39) {
            onArrowClick(1)
        } else if (event.keyCode === 38) {
            onTraitTypeClick(-1)
        } else if (event.keyCode === 40) {
            onTraitTypeClick(1)
        } 
    }
    
    useEffect(() => {
        console.log('Gender switched to: ' + Gender[gender]);
    },[gender]) 

    useEffect(() => {
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

    const traitsJSONFiltered = traitsJSON[activeTraitType].traits.filter(trait => trait.gender === gender || trait.gender === Gender.Unisex)

    return (
        <Wrapper>
            <Content>
                <FactoryWrapper>
                    <TraitSection>
                        <div>
                            <GenderSection>
                                <AnimateSharedLayout>
                                    <GenderSelection title={Gender[gender]}>
                                        <GenderButton 
                                            isSelected={gender === Gender.Male}
                                            title={Gender[Gender.Male]}  
                                            onClick={() => setGender(Gender.Male)}
                                        />
                                        <GenderButton 
                                            isSelected={gender === Gender.Female}
                                            title={Gender[Gender.Female]} 
                                            onClick={() => setGender(Gender.Female)}
                                        />
                                    </GenderSelection>
                                </AnimateSharedLayout>
                            </GenderSection>
                            <TraitTypesSection 
                            
                                imageLayers={imageLayers} 
                                activeTraitType={activeTraitType} 
                                clickTraitType={clickTraitType}  
                            />
                        </div>
                        <TraitSelection 
                            {...{
                                gender,
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

const spring = {
    type: "spring",
    stiffness: 500,
    damping: 35
};

const GenderSection = styled.div`
    margin-bottom: 1rem;
`

const GenderButton = ({title, isSelected, onClick}: any) => {
    return (
        <WrappedGenderButton title={title} onClick={onClick}>
            {isSelected && (
                <motion.div
                    layoutId="outline"
                    className="outline"
                    initial={false}
                    transition={spring}
                />
            )}
            <span
                style={{
                    color: isSelected ? (title === Gender[Gender.Male] ?  "#0070ba" : '#ffb7c5') : (title === Gender[Gender.Male] ? 'black' : 'white'),
                    transform: isSelected ? "scale(1.055)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "all 300ms ease-out",
                    zIndex: 10
                }}
            >
                {title}
            </span>
        </WrappedGenderButton>        
    )
}

const WrappedGenderButton = styled.button<{title: string}>`
    display: flex;  
    width: 140px;
    height: 45px;
    position: relative;
    align-items: center;
    justify-content: center;
    border: 0;
    font-family: 'Rubik', sans-serif;
    font-weight: 600;
    font-size: .95rem;
    background-color: ${props => props.title === Gender[Gender.Male] ? '#0070ba' : " #ffb7c5"};
    background: none;
    cursor: pointer;  
    
    &:focus, &:active {
        outline: none; 
    }
`

const GenderSelection = styled.div<{title: string}>`
    display: flex;
    border-radius: .5rem;
    overflow: hidden;
    margin: 0;
    padding: 4px;
    transition: all 300ms ease-out;
    background-color: ${props => props.title === Gender[Gender.Male] ? 'rgb(141,202,255)' : "#ffb7c5"};
`

const TraitSection = styled.div`
    display: flex;
`

const FactoryWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 15%;
`



export default FactorySection