import { Box, Container, Typography } from '@mui/material';
import React from 'react';

function Greetings(props: any) {
  return (
    <Container>
      <Box component='div' my={{ xs: 3, sm: 5, md: 8 }}>
        <Typography component='h1' variant='h1'>{`Welcome back, ${props.playerInfo.name}!`}</Typography>
      </Box>
    </Container>
  );
}

export default Greetings;
