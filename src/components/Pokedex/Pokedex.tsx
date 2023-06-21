import React, { useState, useEffect, useContext, ChangeEvent, MouseEvent } from 'react';
import styles from '@/styles/components/Pokedex.module.scss';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Search from './Search';
import EntryCard from './EntryCard';
import InfoSection from './InfoSection';
import { Container, Typography } from '@mui/material';
import { FormatColorText, WaterDrop, Favorite } from '@mui/icons-material/';
import PokeAppContext from '@/contexts/PokeAppContext';
import { IPokemon, IPokemonData, IPokemonInfo } from '@/types/PokeApp';

const Pokedex = () => {
  const { pokemonList }: { pokemonList: any } = useContext(PokeAppContext);

  const [formats, setFormats] = useState<string[]>(() => ['text']);
  let [resultList, setResultList] = useState<IPokemonData[]>([]);
  let [searchList, setSearchList] = useState<IPokemonData[]>([]);
  let [favoritesList, setFavoritesList] = useState<IPokemonData[]>([]);
  let [selectedPokemon, setSelectedPokemon] = useState<IPokemonData>();

  useEffect(() => {
    sortList(pokemonList);
  }, [pokemonList]);

  useEffect(() => {
    if (formats.indexOf('faves') > -1) {
      setSearchList(favoritesList);
    } else {
      setSearchList(resultList);
    }
  }, [formats]);

  const sortList = (list: IPokemonData[]) => {
    const sortedList: IPokemonData[] = list.sort((a: IPokemonData, b: IPokemonData) => (a.id > b.id ? 1 : -1));
    setResultList(sortedList);
    setSearchList(sortedList);
  };

  const handleFormat = (event: MouseEvent<HTMLElement>, newFormats: string[]) => setFormats(newFormats);

  return (
    <Container sx={{ my: 4 }}>
      <Typography component='h2' variant='h2'>
        Pokedex
      </Typography>
      <Box display='flex' justifyContent='space-between' alignItems='center' my={2}>
        <Search resultList={resultList} favoritesList={favoritesList} searchBy={formats} setSearchList={setSearchList} />{' '}
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
          {searchList.map((pokemon: IPokemonData, index: number) => (
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
          <InfoSection selectedPokemon={selectedPokemon} />
        </Box>
      </Box>
    </Container>
  );
};

export default Pokedex;
