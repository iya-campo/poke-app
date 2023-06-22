import React, { useContext } from 'react';
import PokeAppContext from '@/contexts/PokeAppContext';
import { IPokemon } from '@/types/PokeApp';
import { Box, Button, Typography } from '@mui/material';
import styles from '@/styles/components/PCStorage.module.scss';
import { capitalize } from '@/utils/Utils';

interface IPCStorageProps {
  withdrawPokemon: (pokemon: IPokemon) => void;
}

function PCStorage({ withdrawPokemon }: IPCStorageProps) {
  const { pcStorage }: { pcStorage: IPokemon[] } = useContext(PokeAppContext);

  return (
    <Box component='div' className={styles.pcStorage}>
      <Typography component='h4' variant='h4' pb={2}>
        PC Storage
      </Typography>
      {pcStorage && pcStorage.length > 0 ? (
        <Box component='div' display='flex' sx={{ maxHeight: '300px', flexWrap: 'wrap', overflowY: 'auto' }}>
          {pcStorage.map((pokemon: IPokemon, index: number) => (
            <Button key={index} variant='outlined' className={styles.storagePokemon} onClick={() => withdrawPokemon(pokemon)}>
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
