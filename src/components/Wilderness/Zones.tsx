import React from 'react';
import { Box, ButtonGroup, Button } from '@mui/material';
import PokemonAPI from '@/api/PokemonAPI';
import { findMatchingTypes } from '@/utils/Utils';

function Zones(props: any) {
  const allocWildPokemon = (zone: string, wildPokemons: any) => {
    let list = [];
    switch (zone) {
      case 'forest':
        list = wildPokemons.filter((wildPokemon: any) => findMatchingTypes(['grass', 'normal', 'bug'], wildPokemon));
        props.setWildPokemons(list);
        props.setZoneImg(`url('/images/forest.png')`);
        break;
      case 'ocean':
        list = wildPokemons.filter((wildPokemon: any) => findMatchingTypes(['water', 'ice'], wildPokemon));
        props.setWildPokemons(list);
        props.setZoneImg(`url('/images/ocean.png')`);
        break;
      case 'volcano':
        list = wildPokemons.filter((wildPokemon: any) => findMatchingTypes(['fire', 'rock', 'ground'], wildPokemon));
        props.setWildPokemons(list);
        props.setZoneImg(`url('/images/volcano.png')`);
        break;
      default:
        console.log('Please select a zone to explore.');
    }
  };

  const selectZone = (e: any) => {
    const zone: string = e.target.value;

    let list: any = [];
    PokemonAPI.fetchPokemon()
      .then((res) => {
        res.results.map((e: any) => {
          fetch(e.url)
            .then((res) => res.json())
            .then((res) => {
              list = [...list, res];
              allocWildPokemon(zone, list);
            });
        });
      })
      .catch((err) => console.log(err));
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
