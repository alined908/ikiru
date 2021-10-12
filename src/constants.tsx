export const projectTitle = "Ikiru";
export const launchDate = new Date(10, 15, 2021);

export enum Rarity {
    Common,
    Rare,
    Epic,
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

export const traitsJSON : ITraitType[] = [
    {
        name: "Background",
        canBeNull: false,
        layer: 0,
        traits: [
            {
                name: "Night Sky",
                probability: 2.5,
                rarity_threshold: Rarity.Epic,
                gender: Gender.Unisex,
                path: "traits/unisex/backgrounds/night_sky.png"
            },
            {
                name: "Green Sakura",
                probability: 2.5,
                rarity_threshold: Rarity.Epic,
                gender: Gender.Unisex,
                path: "traits/unisex/backgrounds/sakura_green.png"
            },
            {
                name: "Solana Seigaha",
                probability: 2.5,
                rarity_threshold: Rarity.Epic,
                gender: Gender.Unisex,
                path: "traits/unisex/backgrounds/seigaha_solana.png"
            },
            {
                name: "Red Square",
                probability: 2.5,
                rarity_threshold: Rarity.Epic,
                gender: Gender.Unisex,
                path: "traits/unisex/backgrounds/square_red.png"
            },
            {
                name: "Red Yagasuri",
                probability: 5,
                rarity_threshold: Rarity.Common,
                gender: Gender.Unisex,
                path: "traits/unisex/backgrounds/yagasuri_red.png"
            },
        ]
    },
    {
        name: "Skin",
        canBeNull: false,
        layer: 1,
        traits: [
            {
                name: "Pale",
                probability: 33,
                rarity_threshold: Rarity.Common,
                gender: Gender.Male,
                path: "traits/male/body/pale.png"
            }
        ]
    },
    {
        name: "Neck",
        canBeNull: true,
        layer: 2,
        traits: [
            {
                name: "Tattoo",
                probability: 33,
                rarity_threshold: Rarity.Common,
                gender: Gender.Male,
                path: "traits/male/neck/tattoo.png"
            }, {
                name: "None",
                probability: 33,
                rarity_threshold: Rarity.Common,
                gender: Gender.Male,
                path: "traits/none.png"
            },
            {
                name: "None",
                probability: 100,
                rarity_threshold: Rarity.Common,
                gender: Gender.Female,
                path: "traits/none.png"
            }
        ]
    },
    {
        name: "Clothes",
        canBeNull: true,
        layer: 3,
        traits: [
            {
                name: "Purple Bomber",
                probability: 7.5,
                rarity_threshold: Rarity.Rare,
                gender: Gender.Male,
                path: "traits/male/clothes/bomber_purple.png"
            }, 
            {
                name: "Yellow T-Shirt",
                probability: 10,
                rarity_threshold: Rarity.Common,
                gender: Gender.Male,
                path: "traits/male/clothes/tshirt_yellow.png"
            },
            {
                name: "Uniform",
                probability: 7.5,
                rarity_threshold: Rarity.Epic,
                gender: Gender.Male,
                path: "traits/male/clothes/uniform.png"
            },
            {
                name: "Blue Yukata",
                probability: 5,
                rarity_threshold: Rarity.Epic,
                gender: Gender.Male,
                path: "traits/male/clothes/yukata_blue.png"
            }
        ]
    },
    {
        name: "Expression",
        canBeNull: false,
        layer: 4,
        traits: [
            {
                name: "Frown",
                probability: 33,
                rarity_threshold: Rarity.Common,
                gender: Gender.Male,
                path: "traits/male/expression/frown.png"
            }, 
            {
                name: "Smile",
                probability: 33,
                rarity_threshold: Rarity.Common,
                gender: Gender.Male,
                path: "traits/male/expression/smile.png"
            }, 
            {
                name: "Smirk",
                probability: 33,
                rarity_threshold: Rarity.Common,
                gender: Gender.Male,
                path: "traits/male/expression/smirk.png"
            }, 
        ]
    },
    {   
        name: "Earring",
        canBeNull: true,
        layer: 5,
        traits: [
            {
                name: "Cross",
                probability: 7.5,
                rarity_threshold: Rarity.Rare,
                gender: Gender.Unisex,
                path: "traits/unisex/earrings/cross.png"
            }, 
            {
                name: "Pearl",
                probability: 7.5,
                rarity_threshold: Rarity.Rare,
                gender: Gender.Unisex,
                path: "traits/unisex/earrings/pearl_earring.png"
            }, 
            {
                name: "Hanafuda",
                probability: 5,
                rarity_threshold: Rarity.Epic,
                gender: Gender.Unisex,
                path: "traits/unisex/earrings/hanafuda.png"
            }, 
            {
                name: "None",
                probability: 100,
                rarity_threshold: Rarity.Common,
                gender: Gender.Unisex,
                path: "traits/none.png"
            }
        ]
    },
    {
        name: "Face Accessory",
        canBeNull: true,
        layer: 6,
        traits: [
            {
                name: "Bandage",
                probability: 5,
                rarity_threshold: Rarity.Rare,
                gender: Gender.Unisex,
                path: "traits/unisex/face_accessory/bandage.png"
            }, 
            {
                name: "Eyepatch",
                probability: 5,
                rarity_threshold: Rarity.Epic,
                gender: Gender.Unisex,
                path: "traits/unisex/face_accessory/eyepatch.png"
            }, 
            {
                name: "None",
                probability: 100,
                rarity_threshold: Rarity.Common,
                gender: Gender.Unisex,
                path: "traits/none.png"
            }
        ],
    },
    {
        name: "Hair",
        canBeNull: false,
        layer: 7,
        traits: [
            {
                name: "Parted",
                probability: 20,
                rarity_threshold: Rarity.Rare,
                gender: Gender.Male,
                path: "traits/male/hair/parted.png"
            }, 
            {
                name: "Parted 2",
                probability: 20,
                rarity_threshold: Rarity.Rare,
                gender: Gender.Male,
                path: "traits/male/hair/parted2.png"
            }, 
            {
                name: "Short",
                probability: 20,
                rarity_threshold: Rarity.Common,
                gender: Gender.Male,
                path: "traits/male/hair/short.png"
            }
        ]
    },
    {
        name: "Head Accessory",
        canBeNull: true,
        layer: 8,
        traits: [
            {
                name: "Fox Mask",
                probability: 5,
                rarity_threshold: Rarity.Common,
                gender: Gender.Male,
                path: "traits/male/head_accessory/fox_mask.png"
            },
            {
                name: "None",
                probability: 100,
                rarity_threshold: Rarity.Common,
                gender: Gender.Male,
                path: "traits/none.png"
            },
            {
                name: "None",
                probability: 100,
                rarity_threshold: Rarity.Common,
                gender: Gender.Female,
                path: "traits/none.png"
            }
        ]
    }
]