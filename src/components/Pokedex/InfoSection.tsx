import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { capitalize, textTransform } from '@/utils/Utils';
import Image from 'next/image';

function InfoSection(props: any) {
  const statNames = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];
  const [pokemon, setPokemon]: any = useState();

  useEffect(() => {
    resetContainerScroll();
  }, [pokemon]);

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

  const resetContainerScroll = () => {
    const element = document.getElementById('infoContainer');
    if (element) element.scrollTop = -element?.scrollHeight;
  };

  return (
    <Box component='div' width='100%'>
      {props.selectedPokemon?.id ? (
        <Box component='div'>
          <Box component='div' display='flex' width='100%' mb={2}>
            <Typography component='h2' variant='h2' aria-label='Name' display='flex' alignItems='flex-end' py={0} pr={1}>
              {pokemon ? capitalize(pokemon?.name) : ''}
            </Typography>
            <Image
              alt={`${props.selectedPokemon?.name} icon`}
              width={50}
              height={50}
              src={props.selectedPokemon?.sprites.versions['generation-v']['black-white'].animated.front_default}
            />
          </Box>
          <Box component='div' id='infoContainer' display='flex' flexWrap='wrap-reverse' height={'300px'} sx={{ overflowY: 'auto' }}>
            <Box component='div' display='flex' flexDirection='column' maxWidth={310} rowGap={2}>
              {pokemon &&
                Object.entries(pokemon).map(([key, value]: any, index: number) => (
                  <Box component='div'>
                    <Typography key={key} component='h4' variant='h4' aria-label='Name' pr={1}>
                      {`${key !== 'name' ? (key !== 'base_experience' ? `${capitalize(textTransform(key))}` : `${capitalize(key)}`) : ''}`}
                      {`${key !== 'name' ? ':' : ''}`}
                    </Typography>
                    <Typography key={value} component='span'>{`${key !== 'name' ? value : ''}`}</Typography>
                  </Box>
                ))}
            </Box>
            <Box component='div' display='flex' justifyContent={!props.isMobile ? 'flex-end' : 'center'} alignItems='flex-start' flexGrow={1}>
              <Image
                alt={`${props.selectedPokemon?.name} image`}
                width={250}
                height={250}
                src={props.selectedPokemon?.sprites.other['official-artwork'].front_default}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <Typography>No Pokemon selected.</Typography>
      )}
    </Box>
  );
}

export default InfoSection;
