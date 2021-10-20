import { Trait } from "./constants";

export const calculateNewIndex = (direction: number, currIndex: number, array: any[]) => {
    if (array.length === 1) {
        return 0;
    }

    const lastPossIndex = array.length - 1;
    let newIndex = direction + currIndex;
    
    return newIndex < 0 ? lastPossIndex : (newIndex > lastPossIndex) ?  0 : newIndex
}

export const calculateRarityScore = (traits: (Trait | null)[]) => {
    // [Rarity Score for a Trait Value] = 1 / ([Number of Items with that Trait Value] / [Total Number of Items in Collection])
    // The total Rarity Score for an NFT is the sum of the Rarity Score of all of it’s trait values.
    let totalScore = 0;

    for(let i = 0; i < traits.length; i++) {
        let trait : Trait | null = traits[i];
        if (trait) {
            let traitRarity = 1/(trait.probability/100) * 100
            totalScore += traitRarity
        }
    }

    return totalScore;
}

export const calculateIndividualScore = (trait: (Trait | null)) => {
    if(trait === null) {
        return 0
    }
    
    return 1/(trait.probability/100) * 100
}