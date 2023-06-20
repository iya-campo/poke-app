import React, { useState } from 'react';
import styles from '@/styles/components/EntryCard.module.scss';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material/';

const EntryCard = (props: any) => {
  const handleFavorites = (pokemon: any) => {
    if (!props.favoritesList.find((favePokemon: any) => favePokemon.id === pokemon.id)) {
      props.setFavoritesList((prevState: any) => [...prevState, pokemon]);
    } else {
      props.setFavoritesList(props.favoritesList.filter((favePokemon: any) => favePokemon.id !== pokemon.id));
    }
  };

  return (
    <Box component='div' sx={{ width: '100%' }}>
      <Button
        onClick={() => props.setSelectedPokemon(props.pokemon)}
        sx={{ backgroundColor: props.selectedPokemon?.name === props.pokemon.name ? '#c9c9c9 !important' : '' }}
        className={styles.card}
      >
        <Typography component='span' sx={{ textAlign: 'left', flexGrow: '1' }}>
          {props.pokemon.name}
        </Typography>
        <IconButton component='label' aria-label='add to favorites' color='primary' onClick={() => handleFavorites(props.pokemon)}>
          {props.favoritesList.includes(props.pokemon) ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </Button>
    </Box>
  );
};

export default EntryCard;
