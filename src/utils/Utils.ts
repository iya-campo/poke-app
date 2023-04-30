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

export const textTransform = (string: string) => {
    const words = string.split(/[-_]/);
    return `${capitalize(words[0])}${words[1] ? ` ${capitalize(words[1])}` : ''}`
}

export const getTypes = (types: any) => {
    let convertedTypes = [];
    for (let i = 0; i < types.length; i++) convertedTypes.push(types[i].type.name)
    return convertedTypes;
}

export const findMatchingTypes = (types: any, pokemon: any) => {
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

export const checkValuablePrice = (valuable: string) => {
    switch (valuable) {
        case 'Stardust':
            return 100;
        case 'Nugget':
            return 200;
        case 'Comet Shard':
            return 300;
        default:    
            return 0;
    }
}

export const checkPokemonStats = (pokemonStats: any) => {
    let avgStat: number = 0;

    if (pokemonStats?.length > 0) {
        avgStat= (pokemonStats[0]?.base_stat +
            pokemonStats[1]?.base_stat +
            pokemonStats[2]?.base_stat +
            pokemonStats[3]?.base_stat +
            pokemonStats[4]?.base_stat +
            pokemonStats[5]?.base_stat) /
            6;
    }
        
    return avgStat;
}

export const checkTeamStats = (team: any) => {
    let avgTeamStat: any = [];
    let statTotal: number = 0;

    team.map((pokemon: any) => {
        avgTeamStat.push(checkPokemonStats(pokemon?.stats))
    })
    
    statTotal = (avgTeamStat.reduce((partialSum: number, a: number) => partialSum + a, 0));

    return statTotal / team.length;
}

export const determineSuccess = (successRate: number) => {
    const num: number = Math.round(Math.floor(Math.random() * 11))

    if (num <= successRate / 10) { 
        return true;
    } else { 
        return false;
    }
}

export const findPokeblockPref = (pokemonTypes: any) => {
    const pokeBlockPrefs: any = [];
    pokemonTypes.map((pokemonType: any) => {
        if (pokemonType === 'Water' || pokemonType === 'Ice') pokeBlockPrefs.push('Sour Pokeblock')
        if (pokemonType === 'Grass' || pokemonType === 'Normal' || pokemonType === 'Flying') pokeBlockPrefs.push('Sweet Pokeblock')
        if (pokemonType === 'Fire' || pokemonType === 'Rock' || pokemonType === 'Ground') pokeBlockPrefs.push('Spicy Pokeblock')
    })
    return pokeBlockPrefs;
}
