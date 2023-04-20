import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

function PartyLeader(props: any) {
  const changePartyLeader = (e: any) => {
    const newPartyLeader = props.team[e.target.value];
    props.setPartyLeader(newPartyLeader);
  };

  return (
    <Box component='div'>
      <FormControl fullWidth>
        <InputLabel id='simple-select-label'>Party Leader</InputLabel>
        <Select
          labelId='simple-select-label'
          id='simple-select'
          label='Party Leader'
          value={props.partyLeader ? props.partyLeader?.order : 0}
          onChange={changePartyLeader}
        >
          {props.team?.map((e: any, index: number) => {
            return (
              <MenuItem key={index} value={index}>
                {e.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Box component='div' mt={1}>
        <Typography>{`HP : ${props.partyLeader?.hp} / ${props.partyLeader?.maxHp}`}</Typography>
      </Box>
    </Box>
  );
}

export default PartyLeader;
