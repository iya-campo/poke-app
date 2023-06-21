import { createContext, Dispatch, SetStateAction } from "react";
import { IPokemon, IItem, IAlerts, IPlayer} from "@/types/PokeApp";
import player from "@/data/Player";
import myTeam from "@/data/MyTeam";

interface IPokeAppContext {
    playerInfo: IPlayer,
    setPlayerInfo: Dispatch<SetStateAction<IPlayer>>,
    team: IPokemon[],
    setTeam: Dispatch<SetStateAction<IPokemon[]>>,
    playerItems: IItem[],
    setPlayerItems: Dispatch<SetStateAction<IItem[]>>,
    partyLeader: IPokemon,
    setPartyLeader: Dispatch<SetStateAction<IPokemon>>,
    pcStorage: IPokemon[]
    setPCStorage: Dispatch<SetStateAction<IPokemon[]>>,
    isInEncounter: boolean
    setIsInEncounter: Dispatch<SetStateAction<boolean>>,
    pokemonList: IPokemon[],
    setOpenAlerts: Dispatch<SetStateAction<IAlerts>>,
    isMobile: boolean
}

export const PokeAppContext = createContext<IPokeAppContext>({
        playerInfo: player,
        setPlayerInfo: null,
        team: myTeam,
        setTeam: null,
        playerItems: [],
        setPlayerItems: null,
        partyLeader: myTeam[0],
        setPartyLeader: null,
        pcStorage: [],
        setPCStorage: null,
        isInEncounter: false,
        setIsInEncounter: null,
        pokemonList: [],
        setOpenAlerts: null,
        isMobile: false,
})

export default PokeAppContext;