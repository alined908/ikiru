import styled from 'styled-components';
import {Tilt, tiltOptions} from '../../components/layout/common';
import { ITrait } from '../../constants';
import { calculateRarityScore } from '../../helpers';
import { NumberAnimated } from '../../components/layout/common';
import { MintButton as Button, RainbowButton } from '../../sections/MintSection';
import {  useRef} from 'react';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

const DisplaySection = styled.div`
`

const BuildABear = styled.div`
    display: flex;
    width: 500px;
    height: 500px;
    box-shadow: var(--shadow-xl);
    position: relative;
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
    align-items: center;
    justify-content: space-evenly;
`

interface DisplayProps {
    imageLayers : (ITrait | null)[]
    generateRandomAvatar: () => void
    clearCanvas: () => void
}

const RarityScore = styled.div`
    font-size: 1.4rem;
    font-weight: 600;
    width: 100px;
`

const Display = ({imageLayers, generateRandomAvatar, clearCanvas} : DisplayProps) => {
    // const rarityScore = useMemo(() => calculateRarityScore(imageLayers), [imageLayers]);

    const bearRef = useRef(null);

    const downloadImage = () => {
        let options = { "cacheBust":true }
        domtoimage.toBlob(bearRef.current!, options).then((blob) => {
            saveAs(blob, 'test.png');
            
        })
    }

    return (
        <DisplaySection>
            <Tilt options={tiltOptions}>
                <BuildABear ref={bearRef}>
                    {(imageLayers).map((trait: ITrait | null, index: number) => {
                        if (trait) {
                            return <Layer key={index} layer={index} src={trait.path}/>
                        } 
                    })}
                </BuildABear>
            </Tilt>
            
            <DisplayActions>
                <RarityScore>
                    <div style={{fontSize: "1rem", color: "var(--light-text)"}}>Rarity</div>
                    <NumberAnimated newTarget={calculateRarityScore(imageLayers)} />
                    
                </RarityScore>
                <RainbowButton onClick={generateRandomAvatar}>
                    Random Avatar
                </RainbowButton>
                <Button size="small" color='white' background="black" onClick={downloadImage}>
                    Download
                </Button>
                
                <Button size="small" color='red' background="black" onClick={clearCanvas}>
                    Clear
                </Button>
            </DisplayActions>
        </DisplaySection>
    )
}

export default Display;