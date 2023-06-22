import React, { Dispatch, MouseEvent, SetStateAction, useContext } from 'react';
import PokeAppContext from '@/contexts/PokeAppContext';
import { IPokemonData } from '@/types/PokeApp';
import { Box, ButtonGroup, Button } from '@mui/material';
import { findMatchingTypes } from '@/utils/Utils';

interface IZonesProps {
  setZoneImg: Dispatch<SetStateAction<string>>;
  setWildPokemons: Dispatch<SetStateAction<IPokemonData[]>>;
}

function Zones({ setZoneImg, setWildPokemons }: IZonesProps) {
  const { pokemonList }: { pokemonList: any } = useContext(PokeAppContext);

  const allocWildPokemon = (zone: string, wildPokemons: IPokemonData[]) => {
    let list: IPokemonData[] = [];
    switch (zone) {
      case 'forest':
        list = wildPokemons.filter((wildPokemon: IPokemonData) => findMatchingTypes(['grass', 'normal', 'bug'], wildPokemon));
        setWildPokemons(list);
        setZoneImg(`url('/images/forest.png')`);
        break;
      case 'ocean':
        list = wildPokemons.filter((wildPokemon: IPokemonData) => findMatchingTypes(['water', 'ice'], wildPokemon));
        setWildPokemons(list);
        setZoneImg(`url('/images/ocean.png')`);
        break;
      case 'volcano':
        list = wildPokemons.filter((wildPokemon: IPokemonData) => findMatchingTypes(['fire', 'rock', 'ground'], wildPokemon));
        setWildPokemons(list);
        setZoneImg(`url('/images/volcano.png')`);
        break;
      default:
        console.log('Please select a zone to explore.');
    }
  };

  const selectZone = (event: MouseEvent<HTMLButtonElement>) => {
    const zone: string = event.currentTarget.value;
    allocWildPokemon(zone, pokemonList);
  };

  return (
    <Box>
      <ButtonGroup variant='contained' aria-label='outlined button group'>
        <Button value={'forest'} onClick={selectZone}>
          Forest
        </Button>
        <Button value={'ocean'} onClick={selectZone}>
          Ocean
        </Button>
        <Button value={'volcano'} onClick={selectZone}>
          Volcano
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default Zones;
