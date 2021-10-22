import { arweaveData } from "./sections/NFTDisplay";

export const projectTitle = "Kizuna";
export const launchDate = new Date(10, 15, 2021);

export const deviceSizes = {
    mobile: '(max-width: 500px)',
    laptop: '(max-width: 1050px)',
  }

export enum Rarity {
    Common,
    Uncommon,
    Rare,
    UltraRare,
    Legendary
}

export enum Gender {
    Unisex,
    Male,
    Female
}

export interface ITraitType {
    name: string
    canBeNull: boolean,
    layer: number,
    traits: ITrait[]
}

export interface ITrait {
    name: string
    probability: number
    rarity: Rarity,
    gender: Gender,
    path: string
    preview? : string
}

export class TraitType implements ITraitType {
    name: string
    canBeNull: boolean
    layer: number
    traits: Trait[]
    nameToMaleTraitMapping: {[traitName: string] : Trait}
    nameToFemaleTraitMapping: {[traitName: string] : Trait}

    constructor({name, canBeNull, layer, traits} : ITraitType) {
        this.name = name;
        this.canBeNull = canBeNull;
        this.layer = layer;
        this.traits = traits;
        this.nameToMaleTraitMapping = {}
        this.nameToFemaleTraitMapping = {}

        this.traitsFilteredByGender(Gender.Female).map((trait: Trait) => 
            this.nameToFemaleTraitMapping[trait.name] = trait
        )
        this.traitsFilteredByGender(Gender.Male).map((trait: Trait) => 
            this.nameToMaleTraitMapping[trait.name] = trait
        )
    }

    traitsFilteredByGender(gender: Gender) : Trait[] {
        return this.traits.filter(trait => trait.gender === gender || trait.gender === Gender.Unisex)
    }

    randomTrait(gender: Gender) : [Trait, number] {
        let filteredTraits = this.traitsFilteredByGender(gender);
        let i;
        let weights : number[] = [];

        for(i = 0; i < filteredTraits.length; i ++) {
            weights[i] = filteredTraits[i].probability + (weights[i - 1] || 0)
        }

        let random = Math.random() * weights[weights.length - 1];

        for (i = 0; i < weights.length; i ++) {
            if (weights[i] > random) {
                break;
            }
        }

        return [filteredTraits[i], i]
    }
}

export const s3Link = "https://kizuna.s3.us-west-2.amazonaws.com/"

export class Trait implements ITrait{
    name: string
    probability: number
    rarity: Rarity
    gender: Gender
    path: string
    preview? : string

    constructor({name, probability, rarity, gender, path, preview} : ITrait) {
        this.name = name;
        this.probability = probability;
        this.rarity = rarity;
        this.gender = gender;
        this.path = s3Link + path;
        if (preview) {
            this.preview = s3Link + preview;
        }
        
    }
}

export class KizunaAvatar {
    traits: Trait[]
    gender: Gender
    image?: string | null
    arweaveData?: arweaveData

    constructor(traits : Trait[], gender : Gender) {
        this.traits = traits;
        this.gender = gender;
    }

    addTrait = (trait: Trait) => {
        this.traits.push(trait);
    }

    assignRarityScore = () => {
        //
    }

    getConnection = () => {
        if (this.arweaveData){
            for(let i = 0; i < this.arweaveData?.attributes!.length; i++) {
                if (this.arweaveData.attributes[i].trait_type === "Connection") {
                    return this.arweaveData.attributes[i].value
                }
            }
        } else {
            return null
        }  
    }
}

export const rarityColor : any = {
    [Rarity.Common]: 'rgb(128,70,27)',
    [Rarity.Uncommon]: 'rgb(0,128,0)',
    [Rarity.Rare]: 'rgb(0,0,205)',
    [Rarity.UltraRare]: 'rgb(191, 64, 191)',
    [Rarity.Legendary] : 'rgb(255,239,0)'
}

export const traitTypes = [
    'Background',
    'Skin',
    'Neck',
    'Clothes',
    'Expression',
    'Earrings',
    'Face Accessory',
    'Hair',
    'Head Accessory'
]

export const BackgroundTraits = [
    new Trait({
        name: "Blood Moon",
        probability: 7.5,
        rarity: Rarity.Uncommon,
        gender: Gender.Unisex,
        path: "traits/backgrounds/blood_moon.png"
    }),
    new Trait({
        name: "Blue Clouds",
        probability: 6,
        rarity: Rarity.Rare,
        gender: Gender.Unisex,
        path: "traits/backgrounds/blue_clouds.png"
    }),
    new Trait({
        name: "Cherry Blossom (Dark)",
        probability: 5.5,
        rarity: Rarity.Rare,
        gender: Gender.Unisex,
        path: "traits/backgrounds/cherry_blossom_(dark).png"
    }),
    new Trait({
        name: "Cherry Blossom (Light)",
        probability: 5.5,
        rarity: Rarity.Rare,
        gender: Gender.Unisex,
        path: "traits/backgrounds/cherry_blossom_(light).png"
    }),
    new Trait({
        name: "Hinomaru",
        probability: 6,
        rarity: Rarity.Rare,
        gender: Gender.Unisex,
        path: "traits/backgrounds/hinomaru.png"
    }),
    new Trait({
        name: "Industrial",
        probability: 2.5,
        rarity: Rarity.Legendary,
        gender: Gender.Unisex,
        path: "traits/backgrounds/industrial.png"
    }),
    new Trait({
        name: "Night Sky (Galaxy)",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Unisex,
        path: "traits/backgrounds/night_sky_(galaxy).png"
    }),
    new Trait({
        name: "Night Sky (Moon)",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Unisex,
        path: "traits/backgrounds/night_sky_(moon).png"
    }),
    new Trait({
        name: "Night Sky (Star)",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Unisex,
        path: "traits/backgrounds/night_sky_(star).png"
    }),
    new Trait({
        name: "Pink Clouds",
        probability: 6,
        rarity: Rarity.Rare,
        gender: Gender.Unisex,
        path: "traits/backgrounds/pink_clouds.png"
    }),
    new Trait({
        name: "Red Square",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Unisex,
        path: "traits/backgrounds/red_square.png"
    }),
    new Trait({
        name: "Red Yagasuri",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Unisex,
        path: "traits/backgrounds/red_yagasuri.png"
    }),
    new Trait({
        name: "Solana Seigaha",
        probability: 3.5,
        rarity: Rarity.UltraRare,
        gender: Gender.Unisex,
        path: "traits/backgrounds/solana_seigaha.png"
    }),
    new Trait({
        name: "Valley",
        probability: 7.5,
        rarity: Rarity.Uncommon,
        gender: Gender.Unisex,
        path: "traits/backgrounds/valley.png"
    })
]

export const Background = new TraitType({
    name: "Background",
    canBeNull: false,
    layer: 0,
    traits: BackgroundTraits 
})

export const SkinTraits = [
    new Trait({
        name: "Pale",
        probability: 30,
        rarity: Rarity.Uncommon,
        gender: Gender.Male,
        path: "traits/male/body/pale.png"
    }),
    new Trait({
        name: "Tan",
        probability: 30,
        rarity: Rarity.Uncommon,
        gender: Gender.Male,
        path: "traits/male/body/tan.png"
    }),
    new Trait({
        name: "Light",
        probability: 40,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/body/light.png"
    }),
    new Trait({
        name: "Pale",
        probability: 30,
        rarity: Rarity.Uncommon,
        gender: Gender.Female,
        path: "traits/female/body/pale.png"
    }),
    new Trait({
        name: "Tan",
        probability: 30,
        rarity: Rarity.Uncommon,
        gender: Gender.Female,
        path: "traits/female/body/tan.png"
    }),
    new Trait({
        name: "Light",
        probability: 40,
        rarity: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/body/light.png"
    }),
]

export const Skin = new TraitType({
    name: "Skin",
    canBeNull: false,
    layer: 1,
    traits: SkinTraits
})

export const NeckTraits = [
    new Trait({
        name: "Stripes",
        probability: 7.5,
        rarity: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/neck/stripes.png",
        preview: "trait_previews/male/neck/stripes.png"
    }), 
    new Trait({
        name: "Brand",
        probability: 10,
        rarity: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/neck/brand.png",
        preview: "trait_previews/male/neck/brand.png"
    }), 
    new Trait({
        name: "Blooming Necklace",
        probability: 10,
        rarity: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/neck/blooming_necklace.png",
        preview: "trait_previews/female/neck/blooming_necklace.png"
    }), 
    new Trait({
        name: "Choker",
        probability: 5,
        rarity: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/neck/choker.png",
        preview: "trait_previews/female/neck/choker.png"
    }),
    new Trait({
        name: "Flower Pendant",
        probability: 10,
        rarity: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/neck/flower_pendant.png",
        preview: "trait_previews/female/neck/flower_pendant.png"
    }),
    new Trait({
        name: "None",
        probability: 82.5,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/none.png"
    }),
    new Trait({
        name: "None",
        probability: 75,
        rarity: Rarity.Common,
        gender: Gender.Female,
        path: "traits/none.png"
    })
]

export const Neck = new TraitType({
    name: "Neck",
    canBeNull: true,
    layer: 2,
    traits: NeckTraits
})

export const ClothesTraits = [
    new Trait({
        name: "Black Collared Shirt",
        probability: 7.5,
        rarity: Rarity.Uncommon,
        gender: Gender.Male,
        path: "traits/male/clothes/black_collared_shirt.png"
    }), 
    new Trait({
        name: "Black Hoodie",
        probability: 8.5,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/clothes/black_hoodie.png"
    }), 
    new Trait({
        name: "Black Striped Yukata",
        probability: 5,
        rarity: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/clothes/black_striped_yukata.png"
    }),
    new Trait({
        name: "Black Tee",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/clothes/black_tee.png"
    }),
    new Trait({
        name: "Blue Tee",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/clothes/blue_tee.png"
    }),
    new Trait({
        name: "Peach Bomber",
        probability: 2.5,
        rarity: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/peach_bomber.png"
    }),
    new Trait({
        name: "Purple Bomber",
        probability: 5,
        rarity: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/clothes/purple_bomber.png"
    }),
    new Trait({
        name: "Red Bomber",
        probability: 5,
        rarity: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/clothes/red_bomber.png"
    }),
    new Trait({
        name: "Solana Bomber",
        probability: 2.5,
        rarity: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/solana_bomber.png"
    }),
    new Trait({
        name: "Brown Jacket Uniform",
        probability: 1,
        rarity: Rarity.Legendary,
        gender: Gender.Male,
        path: "traits/male/clothes/brown_jacket_uniform.png"
    }),
    new Trait({
        name: "Cloud Kimono",
        probability: 2.5,
        rarity: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/cloud_kimono.png"
    }),
    new Trait({
        name: "Jersey",
        probability: 7.5,
        rarity: Rarity.Uncommon,
        gender: Gender.Male,
        path: "traits/male/clothes/jersey.png"
    }),
    new Trait({
        name: "Red Hood Outfit",
        probability: 1,
        rarity: Rarity.Legendary,
        gender: Gender.Male,
        path: "traits/male/clothes/red_hood_outfit.png"
    }),
    new Trait({
        name: "Black Uniform",
        probability: 2.5,
        rarity: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/black_uniform.png"
    }),
    new Trait({
        name: "Purple Uniform",
        probability: 5,
        rarity: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/clothes/purple_uniform.png"
    }),
    new Trait({
        name: "White Collared Shirt",
        probability: 5,
        rarity: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/clothes/white_collared_shirt.png"
    }),
    new Trait({
        name: "White Hoodie",
        probability: 8.5,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/clothes/white_hoodie.png"
    }),
    new Trait({
        name: "Yellow Tee",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/clothes/yellow_tee.png"
    }),
    new Trait({
        name: "None",
        probability: 1,
        rarity: Rarity.Legendary,
        gender: Gender.Male,
        path: "traits/none.png"
    }),
    new Trait({
        name: "Black Collared Shirt",
        probability: 7.5,
        rarity: Rarity.Uncommon,
        gender: Gender.Female,
        path: "traits/female/clothes/black_collared_shirt.png"
    }),
    new Trait({
        name: "Black Tee",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/clothes/black_tee.png"
    }),
    new Trait({
        name: "Blue Striped Yukata",
        probability: 6,
        rarity: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/clothes/blue_striped_yukata.png"
    }),
    new Trait({
        name: "Blue Tee",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/clothes/blue_tee.png"
    }),
    new Trait({
        name: "Peach Bomber",
        probability: 3,
        rarity: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/peach_bomber.png"
    }),
    new Trait({
        name: "Purple Bomber",
        probability: 6,
        rarity: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/clothes/purple_bomber.png"
    }),
    new Trait({
        name: "Red Bomber",
        probability: 6,
        rarity: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/clothes/red_bomber.png"
    }),
    new Trait({
        name: "Solana Bomber",
        probability: 3,
        rarity: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/solana_bomber.png"
    }),
    new Trait({
        name: "Brown Jacket Uniform",
        probability: 1,
        rarity: Rarity.Legendary,
        gender: Gender.Female,
        path: "traits/female/clothes/brown_jacket_uniform.png"
    }),
    new Trait({
        name: "Jersey",
        probability: 8,
        rarity: Rarity.Uncommon,
        gender: Gender.Female,
        path: "traits/female/clothes/jersey.png"
    }),
    new Trait({
        name: "Pink Tee",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/clothes/pink_tee.png"
    }),
    new Trait({
        name: "Purple Kimono",
        probability: 3,
        rarity: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/purple_kimono.png"
    }),
    new Trait({
        name: "Short Sleeve Sweather",
        probability: 9,
        rarity: Rarity.Uncommon,
        gender: Gender.Female,
        path: "traits/female/clothes/short_sleeve_sweather.png"
    }),
    new Trait({
        name: "Black Uniform",
        probability: 2.5,
        rarity: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/black_uniform.png"
    }),
    new Trait({
        name: "White Collared Shirt",
        probability: 5,
        rarity: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/clothes/white_collared_shirt.png"
    }),
    new Trait({
        name: "Yellow Tee",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/clothes/yellow_tee.png"
    })
]

export const Clothes = new TraitType({
    name: "Clothes",
    canBeNull: true,
    layer: 3,
    traits: ClothesTraits
})

export const ExpressionTraits = [
    new Trait({
        name: "Frown",
        probability: 35,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/expression/frown.png",
        preview: "trait_previews/male/expression/frown.png"
    }), 
    new Trait({
        name: "Smile",
        probability: 35,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/expression/smile.png",
        preview: "trait_previews/male/expression/smile.png"
    }), 
    new Trait({
        name: "Smirk",
        probability: 20,
        rarity: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/expression/smirk.png",
        preview: "trait_previews/male/expression/smirk.png"
    }), 
    new Trait({
        name: "Closed Eyes",
        probability: 10,
        rarity: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/expression/closed_eyes.png",
        preview: "trait_previews/male/expression/closed_eyes.png"
    }), 
    new Trait({
        name: "Frown",
        probability: 35,
        rarity: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/expression/frown.png",
        preview: "trait_previews/female/expression/frown.png"
    }), 
    new Trait({
        name: "Smile",
        probability: 35,
        rarity: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/expression/smile.png",
        preview: "trait_previews/female/expression/smile.png"
    }), 
    new Trait({
        name: "Stare",
        probability: 20,
        rarity: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/expression/stare.png",
        preview: "trait_previews/female/expression/stare.png"
    }), 
    new Trait({
        name: "Closed Eyes",
        probability: 10,
        rarity: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/expression/closed_eyes.png",
        preview: "trait_previews/female/expression/closed_eyes.png"
    }), 
]

export const Expression = new TraitType({
    name: "Expression",
    canBeNull: false,
    layer: 4,
    traits: ExpressionTraits
})

export const EarringTraits = [
    new Trait({
        name: "Cross",
        probability: 5,
        rarity: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/earrings/cross.png",
        preview: "trait_previews/male/earrings/cross.png"
    }), 
    new Trait({
        name: "Pearl",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/earrings/pearl.png",
        preview: "trait_previews/male/earrings/pearl.png"
    }), 
    new Trait({
        name: "Hanafuda",
        probability: 2.5,
        rarity: Rarity.Legendary,
        gender: Gender.Male,
        path: "traits/male/earrings/hanafuda.png",
        preview: "trait_previews/male/earrings/hanafuda.png"
    }), 
    new Trait({
        name: "Solana Fire",
        probability: 7.5,
        rarity: Rarity.Uncommon,
        gender: Gender.Male,
        path: "traits/male/earrings/solana_fire.png",
        preview: "trait_previews/male/earrings/solana_fire.png"
    }), 
    new Trait({
        name: "Studs",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/earrings/studs.png",
        preview: "trait_previews/male/earrings/studs.png"
    }), 
    new Trait({
        name: "Cross",
        probability: 5,
        rarity: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/earrings/cross.png",
        preview: "trait_previews/female/earrings/cross.png"
    }), 
    new Trait({
        name: "Pearl",
        probability: 10,
        rarity: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/earrings/pearl.png",
        preview: "trait_previews/female/earrings/pearl.png"
    }), 
    new Trait({
        name: "Hanafuda",
        probability: 2.5,
        rarity: Rarity.Legendary,
        gender: Gender.Female,
        path: "traits/female/earrings/hanafuda.png",
        preview: "trait_previews/female/earrings/hanafuda.png"
    }), 
    new Trait({
        name: "Solana Fire",
        probability: 7.5,
        rarity: Rarity.Uncommon,
        gender: Gender.Female,
        path: "traits/female/earrings/solana_fire.png",
        preview: "trait_previews/female/earrings/solana_fire.png"
    }), 
    new Trait({
        name: "None",
        probability: 65,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/none.png"
    }),
    new Trait({
        name: "None",
        probability: 75,
        rarity: Rarity.Common,
        gender: Gender.Female,
        path: "traits/none.png"
    })
]

export const Earring = new TraitType({   
    name: "Earring",
    canBeNull: true,
    layer: 5,
    traits: EarringTraits
})

export const FaceAccessoryTraits = [
    new Trait({
        name: "Bandage",
        probability: 10,
        rarity: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/face_accessory/bandage.png",
        preview: "trait_previews/male/face_accessory/bandage.png"
    }), 
    new Trait({
        name: "Eyepatch",
        probability: 5,
        rarity: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/face_accessory/eyepatch.png",
        preview: "trait_previews/male/face_accessory/eyepatch.png"
    }), 
    new Trait({
        name: "Bandage",
        probability: 10,
        rarity: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/face_accessory/bandage.png",
        preview: "trait_previews/female/face_accessory/bandage.png"
    }),
    new Trait({
        name: "None",
        probability: 85,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/none.png"
    }),
    new Trait({
        name: "None",
        probability: 90,
        rarity: Rarity.Common,
        gender: Gender.Female,
        path: "traits/none.png"
    }),
]


export const FaceAccessory = new TraitType({
    name: "Face Accessory",
    canBeNull: true,
    layer: 6,
    traits: FaceAccessoryTraits,
})

export const HairTraits = [
    new Trait({
        name: "Parted",
        probability: 33,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/hair/parted.png",
        preview: "trait_previews/male/hair/parted.png"
    }), 
    new Trait({
        name: "Parted Overgrown",
        probability: 33,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/hair/parted_overgrown.png",
        preview: "trait_previews/male/hair/parted_overgrown.png"
    }), 
    new Trait({
        name: "Short",
        probability: 34,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/hair/short.png",
        preview: "trait_previews/male/hair/short.png"
    }),
    new Trait({
        name: "Braided",
        probability: 15,
        rarity: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/hair/braided.png",
        preview: "trait_previews/female/hair/branded.png"
    }), 
    new Trait({
        name: "Bun",
        probability: 30,
        rarity: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/hair/bun.png",
        preview: "trait_previews/female/hair/bun.png"
    }), 
    new Trait({
        name: "Ponytail",
        probability: 30,
        rarity: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/hair/ponytail.png",
        preview: "trait_previews/female/hair/ponytail.png"
    }),
    new Trait({
        name: "Short",
        probability: 20,
        rarity: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/hair/short.png",
        preview: "trait_previews/female/hair/short.png"
    }), 
    new Trait({
        name: "Short Ribbons",
        probability: 5,
        rarity: Rarity.Legendary,
        gender: Gender.Female,
        path: "traits/female/hair/short_ribbons.png",
        preview: "trait_previews/female/hair/short_ribbons.png"
    })
]

export const Hair = new TraitType(
    {
        name: "Hair",
        canBeNull: false,
        layer: 7,
        traits: HairTraits
    }
)

export const HeadAcccessoryTraits = [
    new Trait(
    {
        name: "Fox Mask",
        probability: 2.5,
        rarity: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/head_accessory/fox_mask.png",
        preview: "trait_previews/male/head_accessory/fox_mask.png"
    }),
    new Trait({
        name: "Mask",
        probability: 10,
        rarity: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/head_accessory/mask.png",
        preview: "trait_previews/male/head_accessory/mask.png"
    }),
    new Trait({
        name: "Fox Mask",
        probability: 2.5,
        rarity: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/head_accessory/fox_mask.png",
        preview: "trait_previews/female/head_accessory/fox_mask.png"
    }),
    new Trait({
        name: "Flower",
        probability: 10,
        rarity: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/head_accessory/flower.png",
        preview: "trait_previews/female/head_accessory/flower.png"
    }),
    new Trait({
        name: "Mask",
        probability: 10,
        rarity: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/head_accessory/mask.png",
        preview: "trait_previews/female/head_accessory/mask.png"
    }),
    new Trait({
        name: "None",
        probability: 87.5,
        rarity: Rarity.Common,
        gender: Gender.Male,
        path: "traits/none.png"
    }),
    new Trait({
        name: "None",
        probability: 77.5,
        rarity: Rarity.Common,
        gender: Gender.Female,
        path: "traits/none.png"
    })
]

export const HeadAccessory = new TraitType({
    name: "Head Accessory",
    canBeNull: true,
    layer: 8,
    traits: HeadAcccessoryTraits
})

export const traitsJSON : TraitType[] = [
    Background,
    Skin,
    Neck,
    Clothes,
    Expression,
    Earring,
    FaceAccessory,
    Hair,
    HeadAccessory
]

export const traitTypesMapping = {
    'Background': Background,
    'Skin': Skin,
    'Neck': Neck,
    'Clothes': Clothes,
    'Expression': Expression,
    'Earring': Earring,
    'Face Accessory': FaceAccessory,
    'Hair': Hair,
    'Head Accessory': HeadAccessory
}

export const genderMapping = {
    'Female': Gender.Female,
    'Male': Gender.Male
}