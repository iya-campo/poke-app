import React, { Dispatch, SetStateAction } from 'react';
import { IPokemonData } from '@/types/PokeApp';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material/';
import styles from '@/styles/components/EntryCard.module.scss';

interface IEntryCardProps {
  key: number;
  pokemon: IPokemonData;
  selectedPokemon: IPokemonData;
  setSelectedPokemon: Dispatch<SetStateAction<IPokemonData>>;
  favoritesList: IPokemonData[];
  setFavoritesList: Dispatch<SetStateAction<IPokemonData[]>>;
}

const EntryCard = ({ pokemon, selectedPokemon, setSelectedPokemon, favoritesList, setFavoritesList }: IEntryCardProps) => {
  const handleFavorites = (pokemon: IPokemonData) => {
    if (!favoritesList.find((favePokemon: IPokemonData) => favePokemon.id === pokemon.id)) {
      setFavoritesList((prevState: IPokemonData[]) => [...prevState, pokemon]);
    } else {
      setFavoritesList(favoritesList.filter((favePokemon: IPokemonData) => favePokemon.id !== pokemon.id));
    }
  };

  return (
    <Box component='div' sx={{ width: '100%' }}>
      <Button
        onClick={() =>
          setSelectedPokemon({
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types,
            height: pokemon.height,
            weight: pokemon.weight,
            base_exp: pokemon.base_exp,
            stats: pokemon.stats,
            abilities: pokemon.abilities,
            moves: pokemon.moves,
            sprites: pokemon.sprites,
          })
        }
        sx={{ backgroundColor: selectedPokemon?.name === pokemon.name ? '#c9c9c9 !important' : '' }}
        className={styles.card}
      >
        <Typography component='span' sx={{ textAlign: 'left', flexGrow: '1' }}>
          {pokemon.name}
        </Typography>
        <IconButton component='label' aria-label='add to favorites' color='primary' onClick={() => handleFavorites(pokemon)}>
          {favoritesList.includes(pokemon) ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </Button>
    </Box>
  );
};

export default EntryCard;
