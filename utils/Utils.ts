export const randomNumberGenerator = (min: number, max: number) => {
    return Math.round(Math.floor(Math.random() * (max - min + 1)) + min);
}

export const capitalize = (string: string) => {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
}

export const replaceAll = (string: string, mapObj: any) => {
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return string.replace(re, function(matched){
        return mapObj[matched];
    });
}

export const checkTypeMatch = (types: any, pokemon: any) => {
    return types.some((type: string) => type === pokemon.types[0]?.type.name || type === pokemon.types[1]?.type.name);
}

export const checkItems = (items: any, itemToFind: string, returnType?: string) => {
    let itemExists: boolean = false;
    let itemQuantity: number = 0;

    items.map((item: any) => {
        if (item.name === itemToFind) {
            itemExists = true;
            itemQuantity = item.quantity;
        }
    })
    if (returnType === 'quantity') {
        return itemExists ? itemQuantity : 0;
    }
    return itemExists;
}
