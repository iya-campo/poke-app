import React from 'react';
import { Box, Typography } from '@mui/material';

function GlobalHeader() {
  return (
    <Box py={4} textAlign={'center'} sx={{ backgroundColor: 'black' }}>
      <Typography component='h1' sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '24px', color: 'white' }}>
        Poke App
      </Typography>
    </Box>
  );
}

export default GlobalHeader;
