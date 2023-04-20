import React from 'react';
import styles from '@/styles/components/PokemonCenter.module.scss';
import { Healing, SportsMma, LocalFlorist } from '@mui/icons-material/';
import { Container, Box, Button, Typography } from '@mui/material';

function PokemonCenter(props: any) {
  const healPokemon = (team: any) => {
    team.map((pokemon: any) => {
      pokemon.hp = pokemon.maxHp;
    });
  };

  return (
    <Container sx={{ my: 4 }}>
      <Typography component='h2'>Pokemon Center</Typography>
      <Box component='div' display='flex' justifyContent='space-between' flexWrap='wrap' my={2}>
        <Box className={styles.pokemonCenter}>
          <Healing fontSize='large' color='primary' />
          <Typography component='h4' py={2}>
            Nurse Joy
          </Typography>
          <Button variant='contained' onClick={() => healPokemon(props.team)}>
            Heal Pokemon
          </Button>
        </Box>
        <Box className={styles.pokemonCenter} mx={2}>
          <SportsMma fontSize='large' color='primary' />
          <Typography component='h4' py={2}>
            Trainer Battles
          </Typography>
          <Button variant='contained'>Battle Trainers</Button>
        </Box>
        <Box className={styles.pokemonCenter}>
          <LocalFlorist fontSize='large' color='primary' />
          <Typography component='h4' py={2}>
            Care for Pokemon
          </Typography>
          <Button variant='contained'>Go to Playground</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default PokemonCenter;
