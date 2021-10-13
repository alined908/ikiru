import styled from 'styled-components';
import {Tilt, tiltOptions} from '../../components/layout/common';
import { ITrait } from '../../constants';
import { MintButton as Button, RainbowButton } from '../../sections/MintSection';

const DisplaySection = styled.div`
`

const BuildABear = styled.div`
    display: flex;
    width: 500px;
    height: 500px;
    box-shadow: var(--shadow-xl);
`
interface LayerProps {
    layer: number
}

const Layer = styled.img<LayerProps>`
    z-index: ${props => props.layer};
    position: absolute;
    width: 500px;
    height: 500px;
`

const DisplayActions = styled.div`
    display: flex;
    margin-top: 1.5rem;
    justify-content: space-evenly;
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

export default Display;