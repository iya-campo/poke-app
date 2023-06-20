import React, { useState, useEffect, useContext } from 'react';
import styles from '@/styles/components/Pokedex.module.scss';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Search from './Search';
import EntryCard from './EntryCard';
import InfoSection from './InfoSection';
import { Container, Typography } from '@mui/material';
import { FormatColorText, WaterDrop, Favorite, FilePresent } from '@mui/icons-material/';

const Pokedex = (props: any) => {
  const [formats, setFormats]: any = useState(() => ['text']);
  let [pokemonList, setPokemonList]: any = useState([]);
  let [searchList, setSearchList]: any = useState([]);
  let [selectedPokemon, setSelectedPokemon]: any = useState();
  let [favoritesList, setFavoritesList]: any = useState([]);

  useEffect(() => {
    sortList(props.pokemonList);
  }, [props.pokemonList]);

  useEffect(() => {
    if (formats.indexOf('faves') > -1) {
      setSearchList(favoritesList);
    } else {
      setSearchList(pokemonList);
    }
  }, [formats]);

  const sortList = (list: any) => {
    const sortedList = list.sort((a: any, b: any) => (a.id > b.id ? 1 : -1));
    setPokemonList(sortedList);
    setSearchList(sortedList);
  };

  const handleFormat = (e: any, newFormats: string[]) => {
    setFormats(newFormats);
  };

  return (
    <Container sx={{ my: 4 }}>
      <Typography component='h2' variant='h2'>
        Pokedex
      </Typography>
      <Box display='flex' justifyContent='space-between' alignItems='center' my={2}>
        <Search pokemonList={pokemonList} favoritesList={favoritesList} searchBy={formats} setSearchList={setSearchList} />{' '}
        {/* improve to search by other categories */}
        <ToggleButtonGroup value={formats} onChange={handleFormat} aria-label='search-filters'>
          <ToggleButton value='text' aria-label='filter by text'>
            <FormatColorText />
          </ToggleButton>
          <ToggleButton value='type' aria-label='filter by type'>
            <WaterDrop />
          </ToggleButton>
          <ToggleButton value='faves' aria-label='filter by faves'>
            <Favorite />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box component='div' className={styles.container}>
        <Box component='div' className={styles.listSection}>
          {searchList.map((pokemon: any, index: number) => (
            <EntryCard
              key={index}
              pokemon={pokemon}
              selectedPokemon={selectedPokemon}
              setSelectedPokemon={setSelectedPokemon}
              favoritesList={favoritesList}
              setFavoritesList={setFavoritesList}
            />
          ))}
        </Box>
        <Box component='div' className={styles.infoSection}>
          <InfoSection selectedPokemon={selectedPokemon} isMobile={props.isMobile} />
        </Box>
      </Box>
    </Container>
  );
};

export default Pokedex;
