import React from 'react';
import styles from '@/styles/components/PCStorage.module.scss';
import { Box, Button, Typography } from '@mui/material';
import { capitalize } from 'utils/Utils';

function PCStorage(props: any) {
  return (
    <Box component='div' className={styles.pcStorage}>
      <Typography component='h4' variant='h4' pb={2}>
        PC Storage
      </Typography>
      {props.pcStorage && props.pcStorage.length > 0 ? (
        <Box component='div' display='flex' sx={{ maxHeight: '300px', flexWrap: 'wrap', overflowY: 'auto' }}>
          {props.pcStorage.map((pokemon: any, index: number) => (
            <Button key={index} variant='outlined' className={styles.storagePokemon} onClick={() => props.withdrawPokemon(pokemon)}>
              {capitalize(pokemon?.name)}
            </Button>
          ))}
        </Box>
      ) : (
        <Typography component='span' display='inline-block' pt={2}>
          Explore the wilderness to catch Pokemon!
        </Typography>
      )}
    </Box>
  );
}

export default PCStorage;
