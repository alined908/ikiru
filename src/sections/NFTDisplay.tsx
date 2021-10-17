import styled from 'styled-components';
import {Wrapper, Header, Content, AvatarImage, AvatarWrapperProps} from '../components/layout/common';
import * as anchor from "@project-serum/anchor";
import * as web3 from '@solana/web3.js';
import {deserializeUnchecked} from "borsh";
import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { BinaryReader, BinaryWriter } from 'borsh';
import axios from 'axios';
import base58 from 'bs58';
import nacl from 'tweetnacl';
import { AnchorWallet, useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Gender, KizunaAvatar, Trait, traitsJSON, genderMapping } from '../constants';
import { MintButton } from './MintSection';

export const extendBorsh = () => {
    (BinaryReader.prototype as any).readPubkey = function () {
        const reader = this as unknown as BinaryReader;
        const array = reader.readFixedArray(32);
        return new PublicKey(array);
    };

    (BinaryWriter.prototype as any).writePubkey = function (value: PublicKey) {
        const writer = this as unknown as BinaryWriter;
        writer.writeFixedArray(value.toBuffer());
    };

    (BinaryReader.prototype as any).readPubkeyAsString = function () {
        const reader = this as unknown as BinaryReader;
        const array = reader.readFixedArray(32);
        return base58.encode(array) as string;
    };

    (BinaryWriter.prototype as any).writePubkeyAsString = function (
        value: string,
    ) {
        const writer = this as unknown as BinaryWriter;
        writer.writeFixedArray(base58.decode(value));
    };
};

extendBorsh();

export class Creator {
  address: string;
  verified: boolean;
  share: number;

  constructor(args: {
      address: string;
      verified: boolean;
      share: number;
  }) {
      this.address = args.address;
      this.verified = args.verified;
      this.share = args.share;
  }
}

export class Data {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Creator[] | null;

  constructor(args: {
      name: string;
      symbol: string;
      uri: string;
      sellerFeeBasisPoints: number;
      creators: Creator[] | null;
  }) {
      this.name = args.name;
      this.symbol = args.symbol;
      this.uri = args.uri;
      this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
      this.creators = args.creators;
  }
}

export class Metadata {
  key: string;
  updateAuthority: string;
  mint: string;
  data: Data;
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: number | null;
  arweaveData? : arweaveData;

  constructor(args: {
      updateAuthority: string;
      mint: string;
      data: Data;
      primarySaleHappened: boolean;
      isMutable: boolean;
      editionNonce: number | null;
      arweaveData: object
  }) {
      this.key = "MetadataV1";
      this.updateAuthority = args.updateAuthority;
      this.mint = args.mint;
      this.data = args.data;
      this.primarySaleHappened = args.primarySaleHappened;
      this.isMutable = args.isMutable;
      this.editionNonce = args.editionNonce ?? null;
  }
}

export interface metaplexAttribute {
  trait_type: string
  value: any
}

export interface arweaveData {
  
  name: string
  symbol: string
  description: string
  seller_fee_basis_points: number
  image: string
  external_url: string
  attributes: metaplexAttribute[]
  collection: {
    name: string
    family: string
  },
  properties: {

  }
}

export const METADATA_SCHEMA = new Map<any, any>([
  [
      Data,
      {
          kind: 'struct',
          fields: [
              ['name', 'string'],
              ['symbol', 'string'],
              ['uri', 'string'],
              ['sellerFeeBasisPoints', 'u16'],
              ['creators', { kind: 'option', type: [Creator] }],
          ],
      },
  ],
  [
      Creator,
      {
          kind: 'struct',
          fields: [
              ['address', 'pubkeyAsString'],
              ['verified', 'u8'],
              ['share', 'u8'],
          ],
      },
  ],
  [
      Metadata,
      {
          kind: 'struct',
          fields: [
              ['key', 'u8'],
              ['updateAuthority', 'pubkeyAsString'],
              ['mint', 'pubkeyAsString'],
              ['data', Data],
              ['primarySaleHappened', 'u8'], // bool
              ['isMutable', 'u8'], // bool
          ],
      },
  ],
]);

const SOLANA_TOKEN_ID = new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const SEED = "metadata"
const METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
const updateAuthority = "BDmXj3pCxEqcHpUh6RAtwzJGGsF6YemkpxQoLcNNJTpD";
const QUICKNODE_URL = "https://api.devnet.solana.com"

export const findProgramAddress = async (seeds : any, programId : any) => {
  const result = await web3.PublicKey.findProgramAddress(seeds, programId);

  return result[0]
};

const Display = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 80%;
  margin: 0 auto;
  position: absolute;
  top: 20%;
`

class DisplayNFT  {
  mint: string
  metadata: Data
  arweaveData: arweaveData
  kizunaAvatar: KizunaAvatar

  constructor(mint: string, metadata: Data, arweaveData: arweaveData, kizunaAvatar: KizunaAvatar) {
    this.mint = mint;
    this.metadata = metadata;
    this.arweaveData = arweaveData;
    this.kizunaAvatar = kizunaAvatar;
  }
}

const NFTDisplaySection = () => {

    const [displayNFTs, setDisplayNFTs] = useState<DisplayNFT[]>([]);
    const wallet = useAnchorWallet();

    useEffect(() => {
      (async () => {
        retrieveNFTs(wallet);
      })();
    }, [wallet])

    const retrieveNFTs = async (wallet: AnchorWallet | undefined) => {
      if (!wallet) {
        return
      }

      const publicKey = wallet.publicKey;
      const connection : web3.Connection = new anchor.web3.Connection(QUICKNODE_URL);
      const tokens = (await connection.getParsedTokenAccountsByOwner(publicKey, {programId: SOLANA_TOKEN_ID})).value;
      const nonfungibles = tokens.filter(token => token.account.data.parsed.info.tokenAmount.amount === "1" && token.account.data.parsed.info.tokenAmount.decimals === 0);

      let nftMetadata : Metadata[] = [];

      for(let i = 0; i < nonfungibles.length; i++) {
        let token = nonfungibles[i];
        const mintAddress = new web3.PublicKey(token.account.data.parsed.info.mint)
        const seeds = [Buffer.from(SEED), new web3.PublicKey(METADATA_PROGRAM_ID).toBuffer(), (mintAddress).toBuffer()]
        const pdaAccount = await findProgramAddress(seeds, new web3.PublicKey(METADATA_PROGRAM_ID))
        const pdaAccountInfo = (await connection.getParsedAccountInfo(pdaAccount))
        const pdaAccountData = pdaAccountInfo.value!.data
        const metadata = new Metadata(deserializeUnchecked(
            METADATA_SCHEMA,
            Metadata,
            pdaAccountData as Buffer,
        ));
        nftMetadata.push(metadata);
      }

      //filter by update authority or by collection name
      console.log(nftMetadata);
      const filteredNFTs = nftMetadata.filter((metadata : Metadata) => metadata.updateAuthority === updateAuthority);
      console.log(filteredNFTs);

      for (let i = 0; i < filteredNFTs.length; i++) {
        let metadata = filteredNFTs[i];
        try {
          const result = await axios.get(metadata.data.uri);
          metadata['arweaveData'] = result.data
        } catch (e) {
          console.log('error');
        }
      }
      convertToAvatars(filteredNFTs)
      
    }

    let traitMapping = {
      'Night Sky': traitsJSON[0].traits[0],
      'Green Sakura': traitsJSON[0].traits[1],
      'Solana Seigaha': traitsJSON[0].traits[2],
      'Red Square': traitsJSON[0].traits[3],
      'None': traitsJSON[0] 
    }

    const convertToAvatars = (filteredMetadatas: Metadata[]) => {
      console.log(filteredMetadatas);
      let displayNFTs : DisplayNFT[] = [];
      for (let i = 0 ; i < filteredMetadatas.length; i ++) {
        let metadata = filteredMetadatas[i];
        let arweaveDataObject : arweaveData = metadata.arweaveData!;
        let arweaveTraits : metaplexAttribute[] = arweaveDataObject.attributes;
        let traits : Trait[] = [];

        for (let j = 0; j < arweaveTraits.length; j++ ) {
          let trait : metaplexAttribute = arweaveTraits[j];
        }

        let gender = arweaveTraits[3].value;
        let kizunaAvatar = new KizunaAvatar( traits , Gender.Male)
        kizunaAvatar.image = arweaveDataObject.image;
        kizunaAvatar.arweaveData = arweaveDataObject;

        let displayNFT = new DisplayNFT(metadata.mint, metadata.data, metadata.arweaveData!, kizunaAvatar);
        displayNFTs.push(displayNFT);
      }
      setDisplayNFTs(displayNFTs);
    }

    return (
      <Wrapper>
        <Content>
          <Display>
            {displayNFTs.map((displayNFT : DisplayNFT) => 
              <DisplayAvatar 
                width={380} 
                height={380} 
                image={displayNFT.kizunaAvatar.image!} 
                kizunaAvatar={displayNFT.kizunaAvatar}
                metadata={displayNFT.metadata}
                arweaveData={displayNFT.arweaveData}
              />
            )}
          </Display>
        </Content>
        
      </Wrapper>
    )
  }

  export const DisplayAvatarWrapper = styled.div<AvatarWrapperProps>`
    display: flex;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    border-radius: .25rem;
    max-width: 500px;
`

export const DisplayAvatarTraits = styled.div`
    display: flex;
    flex-wrap: wrap;
 
    max-width: 400px;
    font-size: .8rem;
`

export const DisplayAvatarTrait = styled.div`
    display: flex;
    padding: .5rem;
    border: var(--border);
    border-radius: .25rem;
    margin: .25rem;
    background: white;
    flex-direction: column;

    div {
        color: var(--light-text);
    }

    span {
        font-weight: 500;
    }
`

interface DisplayAvatarProps {
  image: string
  width: number
  height: number
  kizunaAvatar: KizunaAvatar
  arweaveData: arweaveData
  metadata: Data
}

  export const DisplayAvatar = ({image, width, height, kizunaAvatar, arweaveData, metadata} : DisplayAvatarProps) => {
    const wallet = useWallet();
    const connection = useConnection();

    const signMessage = async () => {
        // const connection : web3.Connection = new anchor.web3.Connection(QUICKNODE_URL);
        // const provider = new anchor.Provider(connection, wallet!, {
        //   preflightCommitment: "recent",
        // });
        const message = `Signing to verify`;
        const encodedMessage = new TextEncoder().encode(message);
        const publicKeyUint8 = base58.decode(wallet.publicKey!.toString());
        try {
          const signedMessage = await wallet!.signMessage!(encodedMessage);
          console.log(wallet!.publicKey?.toBase58());
          //This verification should be done in server
          const verify = nacl.sign.detached.verify(encodedMessage, signedMessage, publicKeyUint8);
          console.log(verify);
          console.log(signedMessage)
        } catch(err){ 
          console.warn(err);
        }
    }   

    interface changeMetadataParams {
      mintTokenId: string
      metadata: Data
      arweaveData: arweaveData
    }

    const changeMetadata = async ({mintTokenId, metadata, arweaveData} : changeMetadataParams) => {
      // 1. Make owner sign request
      // 1. Send request with new name/connection field  
      // 2. Check on backend that the request rightfully came from owner of nft (might have to query with tokenid?)
      // 2. If so in backend, using old arweave json a new arweave json is created with fields replaced
      // 3. Send back new arweave link, where client triggers a transaction to change metadata field of nft OR creator_address has permission to change? (this doesnt seem correct tho)
      // 4. On success, query new token state 

      const METADATA_PROGRAM_ID = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

      let sourceAccount = wallet.publicKey;
      let name = metadata.name;
      let symbol = metadata.symbol;
      let link = metadata.uri;
      let fee = metadata.sellerFeeBasisPoints;
      let creatorsAddresses = metadata.creators!.map((creator: Creator) => creator.address);
      let creatorsVerified = metadata.creators!.map((creator: Creator) => creator.verified);
      let creatorsShare = metadata.creators!.map((creator : Creator) => creator.share);


      let mintKey = new web3.PublicKey(mintTokenId);


      let transactionData : Buffer = Buffer.from('2');
      

      let seeds : Buffer[] = [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), mintKey.toBuffer()]
      let metadataAccount = await PublicKey.findProgramAddress(seeds, METADATA_PROGRAM_ID);
    
      let transactionInstruction = new web3.TransactionInstruction({
        keys: [
          {pubkey: new PublicKey(metadataAccount), isSigner: false, isWritable: true},
          {pubkey: new PublicKey(sourceAccount!), isSigner: true, isWritable: false}
        ],
        programId: METADATA_PROGRAM_ID,
        data: transactionData
      });

      let transaction = new web3.Transaction().add(transactionInstruction);
      
      try {
        const request = await wallet.sendTransaction(transaction, connection.connection);
        console.log(request);
      } catch (e) {
        console.log(e);
      }
    }

    return (
        // <Link to={{pathname: '/create', state: {kizunaAvatar: JSON.stringify(kizunaAvatar)}}}>
            // <Tilt options={tiltOptions}>
            <div>
                <DisplayAvatarWrapper width={width} height={height}>
                    <AvatarImage src={image}/>
                </DisplayAvatarWrapper>
                <h3>Attributes</h3>
                <DisplayAvatarTraits>
                    {kizunaAvatar.arweaveData!.attributes.map((attr : metaplexAttribute) => 
                        <DisplayAvatarTrait>
                            <div>{attr.trait_type}</div>
                            <span>{attr.value}</span>
                        </DisplayAvatarTrait>
                    )}
                </DisplayAvatarTraits>
                <MintButton background="black" onClick={signMessage}>Sign Message</MintButton>
                <MintButton background="black" onClick={() => changeMetadata()}>Change Thingy</MintButton>
            </div>
            // </Tilt>
        // </Link>
    )
}



export default NFTDisplaySection;