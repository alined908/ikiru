import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Avatar } from './layout/common';
import { shuffle } from 'lodash';
import { s3Link, sampleKizunaAvatars } from '../constants';

const WrappedRotator = styled.div`
    display: flex;
`

const numAvail = [ ...Array(9).keys() ].map( i => i+1);
let shuffled = shuffle(numAvail);
console.log(shuffled);

const Rotatooor = () => {
    const [numRotation, setNumRotation] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {

            if (numRotation === shuffled.length - 1) {
                shuffled = shuffle(shuffled);
                setNumRotation(0);
            } else {
                setNumRotation(numRotation + 1);
            }

        }, 1000)

        return () => clearInterval(interval);
    })

    const randomNum = shuffled[numRotation];
    console.log(randomNum);
    console.log(sampleKizunaAvatars[randomNum]);

    return (
        <WrappedRotator>
            <Avatar 
                kizunaAvatar={sampleKizunaAvatars[randomNum - 1]} 
                image={`${s3Link}avatars/kizuna_${randomNum}.png`}
            />
        </WrappedRotator>
    )
}

export default Rotatooor