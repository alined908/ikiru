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
    rarity_threshold: Rarity,
    gender: Gender,
    path: string
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
}

export const s3Link = "https://kizuna.s3.us-west-2.amazonaws.com/"

export class Trait implements ITrait{
    name: string
    probability: number
    rarity_threshold: Rarity
    gender: Gender
    path: string

    constructor({name, probability, rarity_threshold, gender, path} : ITrait) {
        this.name = name;
        this.probability = probability;
        this.rarity_threshold = rarity_threshold;
        this.gender = gender;
        this.path = s3Link + path;
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
        probability: 2.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Unisex,
        path: "traits/backgrounds/blood_moon.png"
    }),
    new Trait({
        name: "Blue Clouds",
        probability: 2.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Unisex,
        path: "traits/backgrounds/blue_clouds.png"
    }),
    new Trait({
        name: "Cherry Blossom (Dark)",
        probability: 2.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Unisex,
        path: "traits/backgrounds/cherry_blossom_(dark).png"
    }),
    new Trait({
        name: "Cherry Blossom (Light)",
        probability: 2.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Unisex,
        path: "traits/backgrounds/cherry_blossom_(light).png"
    }),
    new Trait({
        name: "Hinomaru",
        probability: 2.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Unisex,
        path: "traits/backgrounds/hinomaru.png"
    }),
    new Trait({
        name: "Industrial",
        probability: 5,
        rarity_threshold: Rarity.Common,
        gender: Gender.Unisex,
        path: "traits/backgrounds/industrial.png"
    }),
    new Trait({
        name: "Night Sky (Galaxy)",
        probability: 2.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Unisex,
        path: "traits/backgrounds/night_sky_(galaxy).png"
    }),
    new Trait({
        name: "Night Sky (Moon)",
        probability: 2.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Unisex,
        path: "traits/backgrounds/night_sky_(moon).png"
    }),
    new Trait({
        name: "Night Sky (Star)",
        probability: 5,
        rarity_threshold: Rarity.Common,
        gender: Gender.Unisex,
        path: "traits/backgrounds/night_sky_(star).png"
    }),
    new Trait({
        name: "Pink Clouds",
        probability: 5,
        rarity_threshold: Rarity.Common,
        gender: Gender.Unisex,
        path: "traits/backgrounds/pink_clouds.png"
    }),
    new Trait({
        name: "Red Square",
        probability: 5,
        rarity_threshold: Rarity.Common,
        gender: Gender.Unisex,
        path: "traits/backgrounds/red_square.png"
    }),
    new Trait({
        name: "Red Yagasuri",
        probability: 5,
        rarity_threshold: Rarity.Common,
        gender: Gender.Unisex,
        path: "traits/backgrounds/red_yagasuri.png"
    }),
    new Trait({
        name: "Solana Seigaha",
        probability: 5,
        rarity_threshold: Rarity.Common,
        gender: Gender.Unisex,
        path: "traits/backgrounds/solana_seigaha.png"
    }),
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
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/body/pale.png"
    }),
    new Trait({
        name: "Tan",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/body/tan.png"
    }),
    new Trait({
        name: "Light",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/body/light.png"
    }),
    new Trait({
        name: "Pale",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/body/pale.png"
    }),
    new Trait({
        name: "Tan",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/body/tan.png"
    }),
    new Trait({
        name: "Light",
        probability: 33,
        rarity_threshold: Rarity.Common,
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
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/neck/stripes.png"
    }), 
    new Trait({
        name: "Brand",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/neck/brand.png"
    }), 
    new Trait({
        name: "Blooming Necklace",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/neck/blooming_necklace.png"
    }), 
    new Trait({
        name: "Choker",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/neck/choker.png"
    }),
    new Trait({
        name: "Flower Pendant",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/neck/flower_pendant.png"
    }),
    new Trait({
        name: "None",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Unisex,
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
        rarity_threshold: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/clothes/black_collared_shirt.png"
    }), 
    new Trait({
        name: "Black Hoodie",
        probability: 7.5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/clothes/black_hoodie.png"
    }), 
    new Trait({
        name: "Black Striped Yukata",
        probability: 7.5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/clothes/black_striped_yukata.png"
    }),
    new Trait({
        name: "Black Tee",
        probability: 10,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/clothes/black_tee.png"
    }),
    new Trait({
        name: "Blue Tee",
        probability: 10,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/clothes/blue_tee.png"
    }),
    new Trait({
        name: "Peach Bomber",
        probability: 7.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/peach_bomber.png"
    }),
    new Trait({
        name: "Purple Bomber",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/purple_bomber.png"
    }),
    new Trait({
        name: "Red Bomber",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/red_bomber.png"
    }),
    new Trait({
        name: "Solana Bomber",
        probability: 7.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/solana_bomber.png"
    }),
    new Trait({
        name: "Brown Jacket Uniform",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/brown_jacket_uniform.png"
    }),
    new Trait({
        name: "Cloud Kimono",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/cloud_kimono.png"
    }),
    new Trait({
        name: "Jersey",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/jersey.png"
    }),
    new Trait({
        name: "Red Hood Outfit",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/red_hood_outfit.png"
    }),
    new Trait({
        name: "Black Uniform",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/black_uniform.png"
    }),
    new Trait({
        name: "Purple Uniform",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/purple_uniform.png"
    }),
    new Trait({
        name: "White Collared Shirt",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/white_collared_shirt.png"
    }),
    new Trait({
        name: "White Hoodie",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/white_hoodie.png"
    }),
    new Trait({
        name: "Yellow Tee",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/yellow_tee.png"
    }),
    new Trait({
        name: "Black Collared Shirt",
        probability: 7.5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/clothes/black_collared_shirt.png"
    }),
    new Trait({
        name: "Black Tee",
        probability: 10,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/clothes/black_tee.png"
    }),
    new Trait({
        name: "Blue Striped Yukata",
        probability: 7.5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/clothes/blue_striped_yukata.png"
    }),
    new Trait({
        name: "Blue Tee",
        probability: 10,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/clothes/blue_tee.png"
    }),
    new Trait({
        name: "Peach Bomber",
        probability: 7.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/peach_bomber.png"
    }),
    new Trait({
        name: "Purple Bomber",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/purple_bomber.png"
    }),
    new Trait({
        name: "Red Bomber",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/red_bomber.png"
    }),
    new Trait({
        name: "Solana Bomber",
        probability: 7.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/solana_bomber.png"
    }),
    new Trait({
        name: "Brown Jacket Uniform",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/brown_jacket_uniform.png"
    }),
    new Trait({
        name: "Jersey",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/jersey.png"
    }),
    new Trait({
        name: "Pink Tee",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/pink_tee.png"
    }),
    new Trait({
        name: "Purple Kimono",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/purple_kimono.png"
    }),
    new Trait({
        name: "Short Sleeve Sweather",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/short_sleeve_sweather.png"
    }),
    new Trait({
        name: "Uniform",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/uniform.png"
    }),
    new Trait({
        name: "White Collared Shirt",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/white_collared_shirt.png"
    }),
    new Trait({
        name: "Yellow Tee",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
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
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/expression/frown.png"
    }), 
    new Trait({
        name: "Smile",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/expression/smile.png"
    }), 
    new Trait({
        name: "Smirk",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/expression/smirk.png"
    }), 
    new Trait({
        name: "Closed Eyes",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/expression/closed_eyes.png"
    }), 
    new Trait({
        name: "Frown",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/expression/frown.png"
    }), 
    new Trait({
        name: "Smile",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/expression/smile.png"
    }), 
    new Trait({
        name: "Stare",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/expression/stare.png"
    }), 
    new Trait({
        name: "Closed Eyes",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/expression/closed_eyes.png"
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
        probability: 7.5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/earrings/cross.png"
    }), 
    new Trait({
        name: "Pearl",
        probability: 7.5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/earrings/pearl.png"
    }), 
    new Trait({
        name: "Hanafuda",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/earrings/hanafuda.png"
    }), 
    new Trait({
        name: "Solana Fire",
        probability: 7.5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/earrings/solana_fire.png"
    }), 
    new Trait({
        name: "Studs",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/earrings/studs.png"
    }), 
    new Trait({
        name: "Cross",
        probability: 7.5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/earrings/cross.png"
    }), 
    new Trait({
        name: "Pearl",
        probability: 7.5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/earrings/pearl.png"
    }), 
    new Trait({
        name: "Hanafuda",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/earrings/hanafuda.png"
    }), 
    new Trait({
        name: "Solana Fire",
        probability: 7.5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/earrings/solana_fire.png"
    }), 
    new Trait({
        name: "None",
        probability: 100,
        rarity_threshold: Rarity.Common,
        gender: Gender.Unisex,
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
        probability: 5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/face_accessory/bandage.png"
    }), 
    new Trait({
        name: "Eyepatch",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/face_accessory/eyepatch.png"
    }), 
    new Trait({
        name: "Bandage",
        probability: 5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/face_accessory/bandage.png"
    }), 
    new Trait({
        name: "Medical Eyepatch",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/face_accessory/medical_eyepatch.png"
    }),
    new Trait({
        name: "None",
        probability: 100,
        rarity_threshold: Rarity.Common,
        gender: Gender.Unisex,
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
        probability: 20,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/hair/parted.png"
    }), 
    new Trait({
        name: "Parted Overgrown",
        probability: 20,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/hair/parted_overgrown.png"
    }), 
    new Trait({
        name: "Short",
        probability: 20,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/hair/short.png"
    }),
    new Trait({
        name: "Braided",
        probability: 20,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/hair/braided.png"
    }), 
    new Trait({
        name: "Bun",
        probability: 20,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/hair/bun.png"
    }), 
    new Trait({
        name: "Ponytail",
        probability: 20,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/hair/ponytail.png"
    }),
    new Trait({
        name: "Short",
        probability: 20,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/hair/short.png"
    }), 
    new Trait({
        name: "Short Ribbons",
        probability: 20,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/hair/short_ribbons.png"
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
        probability: 5,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/head_accessory/fox_mask.png"
    }),
    new Trait({
        name: "Mask",
        probability: 5,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/head_accessory/mask.png"
    }),
    new Trait({
        name: "Fox Mask",
        probability: 5,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/head_accessory/fox_mask.png"
    }),
    new Trait({
        name: "Flower",
        probability: 5,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/head_accessory/flower.png"
    }),
    new Trait({
        name: "Mask",
        probability: 5,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/head_accessory/mask.png"
    }),
    new Trait({
        name: "None",
        probability: 100,
        rarity_threshold: Rarity.Common,
        gender: Gender.Unisex,
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