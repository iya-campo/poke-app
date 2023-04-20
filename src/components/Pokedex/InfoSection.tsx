import React from 'react';
import styles from '@/styles/components/InfoSection.module.scss';
import { Box, Typography } from '@mui/material';
import { capitalize } from 'utils/Utils';

function InfoSection(props: any) {
  return (
    <Box component='div'>
      {props.selectedPoke.id ? (
        <Box component='div'>
          <Typography component='h2' aria-label='Name' fontWeight='bold' className={styles.name}>
            {capitalize(props.selectedPoke?.name)}
          </Typography>
          <Typography component='h4' aria-label='Type'>
            Type: {capitalize(props.selectedPoke?.types[0].type.name)}{' '}
            {props.selectedPoke?.types[1] ? `| ${capitalize(props.selectedPoke?.types[1].type.name)}` : ''}
          </Typography>
          <Typography component='h4' aria-label='Height'>
            Height:
          </Typography>
          <Typography component='h4' aria-label='Weight'>
            Weight:
          </Typography>
          <Typography component='h4' aria-label='BExp'>
            Base Exp:
          </Typography>
          <Typography component='h4' aria-label='Stats'>
            Stats:
          </Typography>
          <Typography component='h4' aria-label='Abilities'>
            Abilities:
          </Typography>
          <Typography component='h4' aria-label='Moves'>
            Moves:
          </Typography>
          <Typography component='h4' aria-label='Evolution'>
            Evolution:
          </Typography>
        </Box>
      ) : (
        <Typography>No Pokemon selected.</Typography>
      )}
    </Box>
  );
}

export default InfoSection;
