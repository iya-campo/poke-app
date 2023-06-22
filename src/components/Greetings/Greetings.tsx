import React, { useContext } from 'react';
import PokeAppContext from '@/contexts/PokeAppContext';
import { IPlayer } from '@/types/PokeApp';
import { Box, Container, Typography } from '@mui/material';

function Greetings() {
  const { playerInfo }: { playerInfo: IPlayer } = useContext(PokeAppContext);

  return (
    <Container>
      <Box component='div' my={{ xs: 3, sm: 5, md: 8 }}>
        <Typography component='h1' variant='h1'>{`Welcome back, ${playerInfo.name}!`}</Typography>
      </Box>
    </Container>
  );
}

export default Greetings;
