import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Box, Input, InputAdornment } from '@mui/material';
import { Close } from '@mui/icons-material/';
import { IPokemonData } from '@/types/PokeApp';

interface ISearchProps {
  resultList: IPokemonData[];
  favoritesList: IPokemonData[];
  searchBy: string[];
  setSearchList: Dispatch<SetStateAction<IPokemonData[]>>;
}

const Search = ({ resultList, favoritesList, searchBy, setSearchList }: ISearchProps) => {
  let searchKey: string = '';

  const searchHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    searchKey = e.target.value;
    if (searchKey) {
      if (searchBy.indexOf('faves') > -1) {
        setSearchList(() => favoritesList.filter((favorite: IPokemonData) => favorite.name.includes(searchKey.toLowerCase())));
      } else {
        setSearchList(() => resultList.filter((result: IPokemonData) => result.name.includes(searchKey.toLowerCase())));
      }
    } else {
      if (searchBy.indexOf('faves') > -1) {
        setSearchList(favoritesList);
      } else {
        setSearchList(resultList);
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
