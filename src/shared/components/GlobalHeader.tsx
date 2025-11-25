import React from 'react';
import { Box, Container, Link, Typography } from '@mui/material';
import Image from 'next/image';

function GlobalHeader() {
  return (
    <Box bgcolor='black' py={4}>
      <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box component='div' display='flex' alignItems='center'>
          <Image alt='poke-app logo' width={30} height={30} src={'/images/poke-app.png'}></Image>
          <Typography
            component='h1'
            textAlign='center'
            fontWeight='bold'
            textTransform='uppercase'
            color='white'
            fontSize={24}
            pl={2}
            sx={{ display: 'inline' }}
          >
            Poke App
          </Typography>
        </Box>
        <Link color='#fff' sx={{ cursor: 'pointer' }}>
          Sign In
        </Link>
      </Container>
    </Box>
  );
}

export default GlobalHeader;
