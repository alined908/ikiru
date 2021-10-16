import {Wrapper, Content} from '../components/layout/common';
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import { Gender, Rarity, KizunaAvatar, TraitType, Trait, ITrait, ITraitType, traitsJSON } from '../constants';
import {random } from 'lodash';
import Display from '../components/factory/Display';
import TraitTypesSection from '../components/factory/TraitTypesSection';
import TraitSelection from '../components/factory/TraitSelection';
import { calculateNewIndex } from '../helpers';
import {motion, AnimateSharedLayout} from 'framer-motion';
import { useLocation } from 'react-router';

interface FactorySectionProps {
    KizunaAvatar : KizunaAvatar | undefined | null
}

const FactorySection = () => {    
    //If avatar exists then merge into state...
    const location = useLocation();
    const { kizunaAvatar } : any = Object(location.state);
    let kizunaAvatarDeserialized;
    if (kizunaAvatar) {
        kizunaAvatarDeserialized = JSON.parse(kizunaAvatar)
    }
    
    // Keep track of gender state
    const [gender, setGender] = useState<Gender>(kizunaAvatarDeserialized ? kizunaAvatarDeserialized.gender : Gender.Male);
    //Create array tracking the correct trait at traitType[index] 
    const initializedLayers = new Array(9).fill(null); 
    const [imageLayers, setImageLayers] = useState<(ITrait | null)[]>(kizunaAvatarDeserialized ? kizunaAvatarDeserialized.traits : [...initializedLayers]);
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
        window.addEventListener('keyup', onKeyup);
        return () => window.removeEventListener('keyup', onKeyup);
    }, [onKeyup])
    
    useEffect(() => {
        const newLayers = [...initializedLayers];
        newLayers[0] = traitsJSON[0].traits[0];
        setImageLayers([...newLayers]);
        setActiveTraitType(0);
        setActiveTrait(0);
    },[gender]) 

    useEffect(() => {
        console.log("this is called ")
        let imageLayersCopy = [...imageLayers];
        imageLayersCopy[activeTraitType] = traitsJSONGenderFiltered[activeTrait];
        setImageLayers(imageLayersCopy);
    }, [activeTrait])

    useEffect(() => {        
        if (imageLayers[activeTraitType] === null) {
            setActiveTrait(0);
        } else {
            setActiveTrait(traitsJSONGenderFiltered.findIndex(
                (ele) => ele.path === imageLayers[activeTraitType]!.path)
            )
        }
    }, [activeTraitType])

    const generateRandomAvatar = () => {
        let randomizedLayers : (ITrait | null)[] = [];
        let activeTraitIndex = 0;


        for(let i = 0; i < traitsJSON.length; i++) {
            let traitType: ITraitType = traitsJSON[i];
            let possibleCandidates : (ITrait | null)[] = [...traitType.traits].filter(trait => trait.gender === gender || trait.gender === Gender.Unisex);
            let randomIndex = random(0, possibleCandidates.length - 1);
            if (i === activeTraitType) {
                activeTraitIndex = randomIndex;
            }
            let chosen = possibleCandidates[randomIndex] as (null | ITrait);
            randomizedLayers.push(chosen)
        }
        
        setImageLayers([...randomizedLayers]);
        setActiveTrait(activeTraitIndex);
    }

    const generateRandomTrait = () => {
        const lastPossIndex = traitsJSONGenderFiltered.length - 1;
        let randomIndex = activeTrait;
        while (randomIndex === activeTrait && traitsJSONGenderFiltered.length > 1) {
            randomIndex = random(0, lastPossIndex);
        }
        setActiveTrait(randomIndex);
    }

    const clickTrait = (position: number) => {
        setActiveTrait(position);
    }

    const onArrowClick = (direction: number) => {
        setActiveTrait(prevIndex => calculateNewIndex(direction, prevIndex, traitsJSONGenderFiltered));
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

    const traitsJSONGenderFiltered : Trait[] = traitsJSON[activeTraitType].traitsFilteredByGender(gender);

    return (
        <Wrapper>
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
    box-shadow: var(--shadow-m);
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