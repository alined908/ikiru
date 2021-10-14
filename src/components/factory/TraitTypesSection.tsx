import styled from 'styled-components';
import { ITrait, ITraitType, traitsJSON } from '../../constants';

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
                    key={index} 
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

const TraitTypes = styled.div`
    display: flex;
    flex-direction: column;
`


interface TraitTypeProps {
    active: boolean
}

const TraitType = styled.div<TraitTypeProps>`
    display: flex;
    align-items: center;
    padding: 1rem;
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
        transform: scale(1.1);
        background: rgb(225,245, 238);
    `}

    &:hover {
        box-shadow: var(--shadow-m);
        background: rgb(230,245, 238);
    }
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

export default TraitTypesSection