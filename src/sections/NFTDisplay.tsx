import styled from 'styled-components';
import {Wrapper, Header} from '../components/layout/common';

interface NFTDisplayProps {
    address: string
}

const NFTDisplaySection = () => {

    return (
      <Wrapper>
        <Header>
            NFT Display
        </Header>
      </Wrapper>
    )
  }


export default NFTDisplaySection;