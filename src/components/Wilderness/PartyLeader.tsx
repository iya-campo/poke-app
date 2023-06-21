import React, { Dispatch, MouseEvent, SetStateAction, useContext } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, SelectChangeEvent } from '@mui/material';
import { IPokemon } from '@/types/PokeApp';
import PokeAppContext from '@/contexts/PokeAppContext';

interface IPartyLeaderContext {
  team: IPokemon[];
  partyLeader: IPokemon;
  setPartyLeader: Dispatch<SetStateAction<IPokemon>>;
}

function PartyLeader() {
  const { team, partyLeader, setPartyLeader }: IPartyLeaderContext = useContext(PokeAppContext);

  const changePartyLeader = (event: SelectChangeEvent<number>) => {
    const newPartyLeader: IPokemon = team[event.target.value as number];
    setPartyLeader(newPartyLeader);
  };

  return (
    <Box component='div' flexGrow={1}>
      <FormControl fullWidth>
        <InputLabel id='simple-select-label'>Party Leader</InputLabel>
        <Select
          labelId='simple-select-label'
          id='simple-select'
          label='Party Leader'
          value={partyLeader ? partyLeader?.order : 0}
          onChange={changePartyLeader}
        >
          {team?.map((partyPokemon: IPokemon, index: number) => {
            return (
              <MenuItem key={index} value={index}>
                {partyPokemon.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Box component='div' display='flex' justifyContent='space-between' mt={1}>
        <Typography component='span'>{`Lvl. ${partyLeader?.level}`}</Typography>
        <Typography component='span'>{`HP : ${partyLeader?.hp} / ${partyLeader?.maxHp}`}</Typography>
      </Box>
    </Box>
  );
}

export default PartyLeader;
