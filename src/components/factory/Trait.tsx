import styled from 'styled-components';
import { ITrait, ITraitType, Gender, Rarity, rarityColor} from '../../constants';
import {Tilt, tiltOptions} from '../../components/layout/common';

interface TraitProps {
    traitType: ITraitType
    trait: ITrait
    active: boolean
    position: number
    handleClick: (position: number) => void
}

const Trait = ({traitType: {layer}, trait, active, position, handleClick} : TraitProps) => {

    const manageClick = () => {
        handleClick(position);
    }

    return (
        <Tilt options={tiltOptions}>
            <TraitWrapper active={active} rarity={trait.rarity} onClick={manageClick}>
                <TraitImageWrapper>
                    <TraitImage src={trait.preview ? trait.preview : trait.path}/>
                </TraitImageWrapper>
                <TraitDescription>
                    <TraitAttribute>
                        <TraitAttributeValue>
                            {trait.name}
                        </TraitAttributeValue>
                        
                    </TraitAttribute> 
                    <TraitAttributeValue>
                        {trait.probability}%
                    </TraitAttributeValue>
                        
                        
                </TraitDescription>
            </TraitWrapper>
        </Tilt>
    )
}

export default Trait;

interface TraitWrapperProps {
    rarity: Rarity
    active: boolean
}

const TraitWrapper = styled.div<TraitWrapperProps>`
    display: flex;
    flex-direction: column;
    border-radius: .5rem;
    transition: all .25s ease;
    cursor: pointer;
    color: ${props => rarityColor[props.rarity]};
    background: rgba(250, 250, 250, 0.7);
    box-shadow: 0rem 0.1rem .5rem ${props => rarityColor[props.rarity]};
`

const TraitImageWrapper = styled.div`
    border-top-right-radius: .5rem;
    border-top-left-radius: .5rem;
    width: 320px;
    height: 320px;
    overflow: hidden;
`

const TraitImage = styled.img`
    width: 100%;
    height: 100%;
`

const TraitDescription = styled.div`
    display: flex;
    justify-content: space-between;
    padding: .75rem 1rem;
    background: black;
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