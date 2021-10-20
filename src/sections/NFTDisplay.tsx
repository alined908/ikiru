import styled from 'styled-components';
import {Wrapper, Header, Content, AvatarImage} from '../components/layout/common';
import * as anchor from "@project-serum/anchor";
import * as web3 from '@solana/web3.js';
import {deserializeUnchecked} from "borsh";
import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { BinaryReader, BinaryWriter, serialize } from 'borsh';
import axios from 'axios';
import base58 from 'bs58';
import nacl from 'tweetnacl';
import { AnchorWallet, useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Gender, KizunaAvatar, Trait, traitsJSON, genderMapping } from '../constants';
import { MintButton } from './MintSection';
import { Link } from 'react-router-dom';

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

class UpdateMetadataArgs {
  instruction: number = 1;
  data: Data | null;
  // Not used by this app, just required for instruction
  updateAuthority: string | null;
  primarySaleHappened: boolean | null;
  constructor(args: {
    data?: Data;
    updateAuthority?: string;
    primarySaleHappened: boolean | null;
  }) {
    this.data = args.data ? args.data : null;
    this.updateAuthority = args.updateAuthority ? args.updateAuthority : null;
    this.primarySaleHappened = args.primarySaleHappened;
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
    UpdateMetadataArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['data', { kind: 'option', type: Data }],
        ['updateAuthority', { kind: 'option', type: 'pubkeyAsString' }],
        ['primarySaleHappened', { kind: 'option', type: 'u8' }],
      ],
    },
  ],
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
              ['editionNonce', { kind: 'option', type: 'u8' }]
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
      const filteredNFTs = nftMetadata.filter((metadata : Metadata) => metadata.updateAuthority === updateAuthority);

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
            <h1>Your NFTs</h1>
            <div>
            {displayNFTs.map((displayNFT : DisplayNFT) => 
              <DisplayAvatar 
                key={displayNFT.mint}

                image={displayNFT.kizunaAvatar.image!} 
                kizunaAvatar={displayNFT.kizunaAvatar}
                metadata={displayNFT.metadata}
                arweaveData={displayNFT.arweaveData}
                mint={displayNFT.mint}
              />
            )}
            </div>
            <h1>Your Connections</h1>
          </Display>
        </Content>
        
      </Wrapper>
    )
  }

  export const DisplayAvatarWrapper = styled.div`
    display: flex;
    width: 300px;
    height: 300px;
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
  kizunaAvatar: KizunaAvatar
  mint: string
  arweaveData: arweaveData
  metadata: Data
}

  export const DisplayAvatar = ({image, kizunaAvatar, mint, arweaveData, metadata} : DisplayAvatarProps) => {
    const wallet = useWallet();
    const connection = useConnection().connection;

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

    const changeMetadata = async ({mintTokenId, metadata, arweaveData} : changeMetadataParams)  => {
      // 1. Make owner sign request
      // 1. Send request with new name/connection field  
      // 2. Check on backend that the request rightfully came from owner of nft (might have to query with tokenid?)
      // 2. If so in backend, using old arweave json a new arweave json is created with fields replaced
      // 3. Send back new arweave link, where client triggers a transaction to change metadata field of nft OR creator_address has permission to change? (this doesnt seem correct tho)
      // 4. On success, query new token state 

      const METADATA_PROGRAM_ID = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
      const mintKey = new web3.PublicKey(mintTokenId);
      let seeds : Buffer[] = [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), mintKey.toBuffer()]
      let metadataAccount = (await PublicKey.findProgramAddress(seeds, METADATA_PROGRAM_ID))[0];
      let newData = metadata;
      newData.uri = 'https://kizuna.s3.us-west-2.amazonaws.com/0.json'

      const value = new UpdateMetadataArgs({
        data : newData,
        updateAuthority: updateAuthority,
        primarySaleHappened: true
      })
      
      console.log(serialize(METADATA_SCHEMA, value))
      const transactionData : Buffer = Buffer.from(serialize(METADATA_SCHEMA, value));
      
      const keys = [
        {pubkey: new PublicKey(metadataAccount), isSigner: false, isWritable: true},
        {pubkey: new PublicKey(updateAuthority), isSigner: true, isWritable: false}
      ]
    
      let transactionInstruction = new web3.TransactionInstruction({
        keys,
        programId: METADATA_PROGRAM_ID,
        data: transactionData
      });
      let transaction = new web3.Transaction().add(transactionInstruction);
    
      transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
      transaction.feePayer = wallet.publicKey!;
      
      try {
        console.log(wallet.publicKey?.toString());
        const signRequest = await wallet.signTransaction!(transaction);
        console.log(signRequest);
        try {
          const transactionId = await connection.sendRawTransaction(signRequest.serialize());
          console.log(transactionId)

          try {
            await connection.confirmTransaction(transactionId);
            console.log(transactionId);
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
        
        
      } catch (e) {
        console.log(e);
      }
    }

    return (
        // <Link to={{pathname: '/create', state: {kizunaAvatar: JSON.stringify(kizunaAvatar)}}}>
            // <Tilt options={tiltOptions}>
            <div>
                <Link to={`/display/${arweaveData.name.split('#')[1]}`}>
                  <DisplayAvatarWrapper>
                      <AvatarImage src={image}/>
                  </DisplayAvatarWrapper>
                </Link>
                
                <h3>Attributes</h3>
                <DisplayAvatarTraits>
                    {kizunaAvatar.arweaveData!.attributes.map((attr : metaplexAttribute, index: number) => 
                        <DisplayAvatarTrait key={index}>
                            <div>{attr.trait_type}</div>
                            <span>{attr.value}</span>
                        </DisplayAvatarTrait>
                    )}
                </DisplayAvatarTraits>
                {/* <MintButton background="black" size="small" onClick={signMessage}>Sign Message</MintButton> */}
                <MintButton background="black" size="small" onClick={() => changeMetadata({mintTokenId: mint, metadata, arweaveData})}>Change Thingy</MintButton>
            </div>
            // </Tilt>
        // </Link>
    )
}



export default NFTDisplaySection;