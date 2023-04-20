import React from 'react';
import { Box, Input, InputAdornment } from '@mui/material';
import { Close } from '@mui/icons-material/';

const Search = (props: any) => {
  let searchKey = '';

  const searchHandler = (e: any) => {
    searchKey = e.target.value;
    if (searchKey) {
      if (props.searchBy.indexOf('faves') > -1) {
        props.setSearchList(() => props.favoritesList.filter((e: any) => e.name.includes(searchKey)));
      } else {
        props.setSearchList(() => props.pokemonList.filter((e: any) => e.name.includes(searchKey)));
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
    <Box component='div'>
      <Input placeholder='Search...' type='search' onChange={searchHandler} endAdornment={endAdornment()} />
    </Box>
  );
};

export default Search;
