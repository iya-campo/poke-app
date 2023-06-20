import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

function PartyLeader(props: any) {
  const changePartyLeader = (e: any) => {
    const newPartyLeader = props.team[e.target.value];
    props.setPartyLeader(newPartyLeader);
  };

  return (
    <Box component='div' flexGrow={1}>
      <FormControl fullWidth>
        <InputLabel id='simple-select-label'>Party Leader</InputLabel>
        <Select
          labelId='simple-select-label'
          id='simple-select'
          label='Party Leader'
          value={props.partyLeader ? props.partyLeader?.order : 0}
          onChange={changePartyLeader}
        >
          {props.team?.map((partyPokemon: any, index: number) => {
            return (
              <MenuItem key={index} value={index}>
                {partyPokemon.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Box component='div' display='flex' justifyContent='space-between' mt={1}>
        <Typography component='span'>{`Lvl. ${props.partyLeader?.level}`}</Typography>
        <Typography component='span'>{`HP : ${props.partyLeader?.hp} / ${props.partyLeader?.maxHp}`}</Typography>
      </Box>
    </Box>
  );
}

export default PartyLeader;
