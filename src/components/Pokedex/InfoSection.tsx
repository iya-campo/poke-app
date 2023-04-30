import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { capitalize, textTransform } from '@/utils/Utils';
import Image from 'next/image';

function InfoSection(props: any) {
  const statNames = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];
  const [pokemon, setPokemon]: any = useState();

  useEffect(() => {
    if (props.selectedPokemon) {
      setPokemon({
        name: props.selectedPokemon.name,
        types:
          capitalize(props.selectedPokemon?.types[0].type.name) +
          (props.selectedPokemon?.types[1] ? ` | ${capitalize(props.selectedPokemon?.types[1].type.name)}` : ''),
        height: `${props.selectedPokemon.height}0 cm`,
        weight: `${props.selectedPokemon.weight} kg`,
        // base_exp: props.selectedPokemon.base_experience,
        stats: props.selectedPokemon.stats.map((stat: any, index: number) => `${index !== 0 ? ' ' : ''}${statNames[index]}: ${stat.base_stat}`),
        abilities: props.selectedPokemon.abilities.map(
          (ability: any, index: number) => `${index !== 0 ? ' ' : ''}${textTransform(capitalize(ability.ability.name))}`
        ),
        moves: props.selectedPokemon.moves.slice(0, 5).map((move: any, index: number) => `${index !== 0 ? ' ' : ''}${textTransform(move.move.name)}`),
      });
    }
  }, [props.selectedPokemon]);

  return (
    <Box component='div' width='100%'>
      {props.selectedPokemon?.id ? (
        <Box component='div' display='flex' flexWrap='wrap-reverse' height='100%' overflow='auto'>
          <Box component='div'>
            <Box component='div' display='flex' alignItems='flex-end' mb={2}>
              <Typography component='h2' variant='h2' aria-label='Name' py={0} pr={1}>
                {pokemon ? capitalize(pokemon?.name) : ''}
              </Typography>
              <Image
                alt='entry pokemon icon'
                width={50}
                height={50}
                src={props.selectedPokemon?.sprites.versions['generation-v']['black-white'].animated.front_default}
              />
            </Box>
            {pokemon &&
              Object.entries(pokemon).map(([key, value]: any, index: number) => (
                <Box key={index} component='div' display='flex' mb={0.5}>
                  <Typography key={key} component='h4' variant='h4' aria-label='Name' pr={1}>
                    {`${key !== 'name' ? (key !== 'base_experience' ? `${capitalize(textTransform(key))}` : `${capitalize(key)}`) : ''}`}
                    {`${key !== 'name' ? ':' : ''}`}
                  </Typography>
                  <Typography key={value} component='span'>{`${key !== 'name' ? value : ''}`}</Typography>
                </Box>
              ))}
          </Box>
          <Box component='div' display='flex' justifyContent={window.innerWidth > 720 ? 'flex-end' : 'center'} alignItems='center' flexGrow={1}>
            <Image alt='entry pokemon art' width={250} height={250} src={props.selectedPokemon?.sprites.other['official-artwork'].front_default} />
          </Box>
        </Box>
      ) : (
        <Typography>No Pokemon selected.</Typography>
      )}
    </Box>
  );
}

export default InfoSection;
