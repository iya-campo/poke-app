import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { capitalize, textTransform } from '@/utils/Utils';
import Image from 'next/image';
import styles from '../../styles/components/InfoSection.module.scss';
import { IPokemonData, IPokemonDataStats, IPokemonInfo } from '@/types/PokeApp';
import PokeAppContext from '@/contexts/PokeAppContext';

interface IInfoSectionProps {
  selectedPokemon: IPokemonData;
}

function InfoSection({ selectedPokemon }: IInfoSectionProps) {
  const { isMobile }: { isMobile: boolean } = useContext(PokeAppContext);

  const statNames: string[] = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];
  const [pokemon, setPokemon] = useState<IPokemonInfo>();

  useEffect(() => {
    if (selectedPokemon) {
      setPokemon({
        name: selectedPokemon.name,
        types:
          capitalize(selectedPokemon?.types[0].type.name) +
          (selectedPokemon?.types[1] ? ` | ${capitalize(selectedPokemon?.types[1].type.name)}` : ''),
        height: `${selectedPokemon.height}0 cm`,
        weight: `${selectedPokemon.weight} kg`,
        // base_exp: selectedPokemon.base_experience,
        stats: selectedPokemon.stats.map(
          (stat: IPokemonDataStats, index: number) => `${index !== 0 ? ' ' : ''}${statNames[index]}: ${stat.base_stat}`
        ),
        abilities: selectedPokemon.abilities.map(
          (ability: any, index: number) => `${index !== 0 ? ' ' : ''}${textTransform(capitalize(ability.ability.name))}`
        ),
        moves: selectedPokemon.moves.slice(0, 5).map((move: any, index: number) => `${index !== 0 ? ' ' : ''}${textTransform(move.move.name)}`),
      });
    }
  }, [selectedPokemon]);

  useEffect(() => {
    resetContainerScroll();
  }, [selectedPokemon]);

  const resetContainerScroll = () => {
    const element: HTMLElement = document.getElementById('infoContainer');
    if (element) element.scrollTop = -element?.scrollHeight;
  };

  return (
    <Box component='div' width='100%'>
      {selectedPokemon?.id ? (
        <Box component='div'>
          <Box component='div' display='flex' width='100%' mb={2}>
            <Typography component='h2' variant='h2' aria-label='Name' display='flex' alignItems='flex-end' py={0} pr={1}>
              {pokemon ? capitalize(pokemon?.name) : ''}
            </Typography>
            <Image
              alt={`${selectedPokemon?.name} icon`}
              width={50}
              height={50}
              src={selectedPokemon?.sprites.versions['generation-v']['black-white'].animated.front_default}
            />
          </Box>
          <Box component='div' id='infoContainer' className={styles.infoContainer}>
            <Box component='div' display='flex' flexDirection='column' maxWidth={310} rowGap={2}>
              {pokemon &&
                Object.entries(pokemon).map(([key, value]: any) => (
                  <Box component='div'>
                    <Typography key={key} component='h4' variant='h4' aria-label='Name' pr={1}>
                      {`${key !== 'name' ? (key !== 'base_experience' ? `${capitalize(textTransform(key))}` : `${capitalize(key)}`) : ''}`}
                      {`${key !== 'name' ? ':' : ''}`}
                    </Typography>
                    <Typography key={value} component='span'>{`${key !== 'name' ? value : ''}`}</Typography>
                  </Box>
                ))}
            </Box>
            <Box component='div' display='flex' justifyContent={!isMobile ? 'flex-end' : 'center'} alignItems='flex-start' flexGrow={1}>
              <Image
                alt={`${selectedPokemon?.name} image`}
                width={250}
                height={250}
                src={selectedPokemon?.sprites.other['official-artwork'].front_default}
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
