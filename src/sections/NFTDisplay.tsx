import styled from 'styled-components';
import {Wrapper, Header} from '../components/layout/common';
import * as anchor from "@project-serum/anchor";
import * as web3 from '@solana/web3.js';
import {deserializeUnchecked} from "borsh";
import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { BinaryReader, BinaryWriter } from 'borsh';
import axios from 'axios';
import base58 from 'bs58';
import { AnchorWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { Wallet } from '@solana/wallet-adapter-wallets';
import { Avatar } from '../components/layout/common';

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

export interface arweaveData {
  collection: {
    name: string
  },
  image: string
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
const updateAuthority = "85boTEyWAik2jqwdqjQZ4e7RUXUCg2SgQFALhKY8Cjak";
const QUICKNODE_URL = "https://api.devnet.solana.com"

export const findProgramAddress = async (seeds : any, programId : any) => {
  const result = await web3.PublicKey.findProgramAddress(seeds, programId);

  return result[0]
};

const Display = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
  width: 70%;
  margin: 0 auto;
`

const NFTDisplaySection = () => {

    const [Nfts, setNfts] = useState<Metadata[]>([]);
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

      setNfts(filteredNFTs);
    }

    return (
      <Wrapper>
        <Display>
          {Nfts.filter((nft) => (nft.arweaveData as arweaveData).collection && (nft.arweaveData as arweaveData).collection.name === "Pigs on Solana Season #1").map((metadata : Metadata) => 
            <Avatar width={380} height={380} image={metadata!.arweaveData!.image}/>
          )}
        </Display>
      </Wrapper>
    )
  }


export default NFTDisplaySection;