export interface IPlayer {
    id: number,
    name: string,
    gender: string,
    pokeDollars: number,
    playTime: number
}

export interface IPokemon {
    id: number,
    order: number,
    name: string,
    types: string[],
    affection: number,
    hp: number,
    maxHp: number,
    level: number,
    currentExp: number,
    expNeeded: number,
    stats: IPokemonStats[],
    img: string
}

export interface IWildPokemon extends IPokemon {}

export interface IItem {
    id: number,
    name: string,
    type: string,
    qty?: number,
    icon: string,
}

export interface ICartItem extends IItem {
    price: number,
    stock: number,
    inCart: number,
}

export interface IPokemonInfo {
    name: string,
    types: string,
    height: string,
    weight: string,
    stats: string[],
    abilities: string[],
    moves: string[],
}

export interface IPokemonData extends Omit<IPokemonInfo, 'types'|'stats'> {
    id: number,
    name: string,
    types: IPokemonDataTypes[],
    stats: IPokemonDataStats[],
    base_exp: number,
    sprites: any,
}

export interface IPokemonDataTypes {
    type: {
        name: string
    }
}

export interface IPokemonDataStats {
    base_stat: number,
}

export interface IPokemonStats {
    name: string,
    base_stat: number
}

export interface IAlerts {
    isOpen: boolean,
    msg: string
}