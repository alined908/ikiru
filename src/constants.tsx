import { arweaveData } from "./sections/NFTDisplay";

export const projectTitle = "Kizuna";
export const launchDate = new Date(10, 15, 2021);

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

    constructor({name, canBeNull, layer, traits} : ITraitType) {
        this.name = name;
        this.canBeNull = canBeNull;
        this.layer = layer;
        this.traits = traits;
    }

    traitsFilteredByGender(gender: Gender) : Trait[] {
        //Filter by gender
        //Return traits
        return this.traits.filter(trait => trait.gender === gender || trait.gender === Gender.Unisex)
    }
}

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
        this.path = path;
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

export const rarityColor = {
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
        name: "Night Sky",
        probability: 2.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Unisex,
        path: "traits/unisex/backgrounds/night_sky.png"
    }),
    new Trait({
        name: "Green Sakura",
        probability: 2.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Unisex,
        path: "traits/unisex/backgrounds/sakura_green.png"
    }),
    new Trait({
        name: "Solana Seigaha",
        probability: 2.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Unisex,
        path: "traits/unisex/backgrounds/seigaha_solana.png"
    }),
    new Trait({
        name: "Red Square",
        probability: 2.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Unisex,
        path: "traits/unisex/backgrounds/square_red.png"
    }),
    new Trait({
        name: "Red Yagasuri",
        probability: 5,
        rarity_threshold: Rarity.Common,
        gender: Gender.Unisex,
        path: "traits/unisex/backgrounds/yagasuri_red.png"
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
]

export const Skin = new TraitType({
    name: "Skin",
    canBeNull: false,
    layer: 1,
    traits: SkinTraits
})

export const NeckTraits = [
    new Trait({
        name: "Tattoo",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/neck/tattoo.png"
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
        name: "Purple Bomber",
        probability: 7.5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/clothes/bomber_purple.png"
    }), 
    new Trait({
        name: "Orange Bomber",
        probability: 7.5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/clothes/bomber_orange.png"
    }),
    new Trait({
        name: "Yellow T-Shirt",
        probability: 10,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/clothes/tshirt_yellow.png"
    }),
    new Trait({
        name: "Pink T-Shirt",
        probability: 10,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/clothes/tshirt_pink.png"
    }),
    new Trait({
        name: "Uniform",
        probability: 7.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/uniform.png"
    }),
    new Trait({
        name: "Uniform",
        probability: 7.5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/uniform.png"
    }),
    new Trait({
        name: "Blue Yukata",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Male,
        path: "traits/male/clothes/yukata_blue.png"
    }),
    new Trait({
        name: "Purple Yukata",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/clothes/yukata_purple.png"
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
        name: "Open",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/expression/open.png"
    }), 
    new Trait({
        name: "Smile",
        probability: 33,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/expression/smile.png"
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
        gender: Gender.Unisex,
        path: "traits/unisex/earrings/cross.png"
    }), 
    new Trait({
        name: "Pearl",
        probability: 7.5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Unisex,
        path: "traits/unisex/earrings/pearl_earring.png"
    }), 
    new Trait({
        name: "Hanafuda",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Unisex,
        path: "traits/unisex/earrings/hanafuda.png"
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
        name: "None",
        probability: 100,
        rarity_threshold: Rarity.Common,
        gender: Gender.Unisex,
        path: "traits/none.png"
    }),
    new Trait({
        name: "Bandage",
        probability: 5,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/face_accessory/bandage.png"
    }), 
    new Trait({
        name: "Joker Mask",
        probability: 5,
        rarity_threshold: Rarity.UltraRare,
        gender: Gender.Female,
        path: "traits/female/face_accessory/joker_mask.png"
    }) 
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
        name: "Parted 2",
        probability: 20,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Male,
        path: "traits/male/hair/parted2.png"
    }), 
    new Trait({
        name: "Short",
        probability: 20,
        rarity_threshold: Rarity.Common,
        gender: Gender.Male,
        path: "traits/male/hair/short.png"
    }),
    new Trait({
        name: "Long",
        probability: 20,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/hair/long.png"
    }), 
    new Trait({
        name: "Bonnet",
        probability: 20,
        rarity_threshold: Rarity.Rare,
        gender: Gender.Female,
        path: "traits/female/hair/bonnet.png"
    }), 
    new Trait({
        name: "Ponytail",
        probability: 20,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/hair/ponytail.png"
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
        name: "Fox Mask",
        probability: 5,
        rarity_threshold: Rarity.Common,
        gender: Gender.Female,
        path: "traits/female/head_accessory/fox_mask.png"
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

export const genderMapping = {
    'Female': Gender.Female,
    'Male': Gender.Male
}