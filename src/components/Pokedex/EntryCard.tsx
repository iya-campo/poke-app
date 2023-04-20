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
      <Button className={styles.card} onClick={() => props.setSelectedPoke(props.data)}>
        <Typography component='span'>{props.data.name}</Typography>

        <IconButton component='label' aria-label='add to favorites' color='primary' onClick={() => handleFavorites(props.data)}>
          {props.favoritesList.includes(props.data) ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </Button>
    </Box>
  );
};

export default EntryCard;
