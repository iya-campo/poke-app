import React, { Dispatch, MouseEvent, SetStateAction, useContext } from 'react';
import PokeAppContext from '@/contexts/PokeAppContext';
import { IPokemonData } from '@/types/PokeApp';
import { Box, ButtonGroup, Button, capitalize } from '@mui/material';
import { findMatchingTypes } from '@/utils/Utils';
import { ZONES, ZONE_FOREST, ZONE_OCEAN, ZONE_VOLCANO } from '@/utils/Constants';

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
        list = wildPokemons.filter((wildPokemon: IPokemonData) => findMatchingTypes(ZONE_FOREST, wildPokemon));
        break;
      case 'ocean':
        list = wildPokemons.filter((wildPokemon: IPokemonData) => findMatchingTypes(ZONE_OCEAN, wildPokemon));
        break;
      case 'volcano':
        list = wildPokemons.filter((wildPokemon: IPokemonData) => findMatchingTypes(ZONE_VOLCANO, wildPokemon));
        break;
      default:
        console.log('Please select a zone to explore.');
    }
    setWildPokemons(list);
    setZoneImg(`url('/images/${zone}.png')`);
  };

  const selectZone = (event: MouseEvent<HTMLButtonElement>) => {
    const zone: string = event.currentTarget.value;
    allocWildPokemon(zone, pokemonList);
  };

  return (
    <Box>
      <ButtonGroup variant='contained' aria-label='outlined button group'>
        {ZONES.map((zone: string, index: number) => (
          <Button key={index} value={zone} onClick={selectZone}>
            {capitalize(zone)}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}

export default Zones;
