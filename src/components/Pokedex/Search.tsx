import React from 'react';
import { Box, Input, InputAdornment } from '@mui/material';
import { Close } from '@mui/icons-material/';

const Search = (props: any) => {
  let searchKey = '';

  const searchHandler = (e: any) => {
    searchKey = e.target.value;
    if (searchKey) {
      if (props.searchBy.indexOf('faves') > -1) {
        props.setSearchList(() => props.favoritesList.filter((e: any) => e.name.includes(searchKey.toLowerCase())));
      } else {
        props.setSearchList(() => props.pokemonList.filter((e: any) => e.name.includes(searchKey.toLowerCase())));
      }
    } else {
      if (props.searchBy.indexOf('faves') > -1) {
        props.setSearchList(props.favoritesList);
      } else {
        props.setSearchList(props.pokemonList);
      }
    }
  };

  const endAdornment = () => {
    if (searchKey) {
      return (
        <InputAdornment position='end'>
          <Close />
        </InputAdornment>
      );
    }
  };

  return (
    <Box component='div' display='flex' flexGrow={1} mr={{ xs: 3, sm: 5, md: 8 }}>
      <Input placeholder='Search...' type='search' onChange={searchHandler} endAdornment={endAdornment()} fullWidth />
    </Box>
  );
};

export default Search;
