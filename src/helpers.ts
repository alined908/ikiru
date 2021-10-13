export const calculateNewIndex = (direction: number, currIndex: number, array: any[]) => {
    console.log(direction, currIndex, array);
    if (array.length === 1) {
        return 0;
    }

    const lastPossIndex = array.length - 1;
    let newIndex = direction + currIndex;
    
    return newIndex < 0 ? lastPossIndex : (newIndex > lastPossIndex) ?  0 : newIndex
}