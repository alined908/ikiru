import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Avatar } from './layout/common';
import { shuffle } from 'lodash';
import { s3Link } from '../constants';

const WrappedRotator = styled.div`
    display: flex;
`

const numAvail = [ ...Array(8).keys() ].map( i => i+1);
let shuffled = shuffle(numAvail);

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

    return (
        <WrappedRotator>
            <Avatar width={465} height={465} image={`${s3Link}avatars/kizuna_${shuffled[numRotation]}.png`}/>
        </WrappedRotator>
    )
}

export default Rotatooor