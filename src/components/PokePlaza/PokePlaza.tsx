import React, { useState, useEffect } from 'react';
import styles from '@/styles/components/PokePlaza.module.scss';
import { Healing, Favorite, Cancel, SportsMma, LocalFlorist } from '@mui/icons-material/';
import { Container, Box, Button, Typography } from '@mui/material';
import CustomModal from '@/shared/components/CustomModal';
import BattleArena from './BattleArena';
import DayCare from './DayCare';

function PokePlaza(props: any) {
  const [isFullyRecovered, setIsFullyRecovered] = useState(true);
  const [openBattleArena, setOpenBattleArena] = useState(false);
  const [openDayCare, setOpenDayCare] = useState(false);

  const handleOpen = (modalName: string) => {
    switch (modalName) {
      case 'Battle Arena':
        setOpenBattleArena(true);
        break;
      case 'Day Care':
        setOpenDayCare(true);
        break;
    }
  };

  useEffect(() => {
    setIsFullyRecovered(!props.team.some((pokemon: any) => pokemon.hp !== pokemon.maxHp));
  }, [props.partyLeader]);

  const healPokemon = () => {
    props.team.map((pokemon: any) => {
      pokemon.hp = pokemon.maxHp;
    });
    props.setPartyLeader((prevState: any) => ({ ...prevState, hp: prevState.maxHp }));
    props.setOpenAlerts({
      isOpen: true,
      msg: 'Your Pokemon is fully recovered!',
    });
  };

  return (
    <>
      <CustomModal
        open={openBattleArena}
        setOpen={setOpenBattleArena}
        component={<BattleArena playerItems={props.playerItems} setPlayerItems={props.setPlayerItems} setOpenAlerts={props.setOpenAlerts} />}
      />
      <CustomModal
        open={openDayCare}
        setOpen={setOpenDayCare}
        component={
          <DayCare
            team={props.team}
            setTeam={props.setTeam}
            playerItems={props.playerItems}
            setPlayerItems={props.setPlayerItems}
            setOpenAlerts={props.setOpenAlerts}
          />
        }
      />
      <Container sx={{ my: 4 }}>
        <Typography component='h2' variant='h2'>
          Poke Plaza
        </Typography>
        <Box component='div' display='flex' justifyContent='space-between' flexWrap='wrap' my={2}>
          <Box className={styles.pokePlaza}>
            {props.isInEncounter ? (
              <Cancel fontSize='large' color='primary' />
            ) : isFullyRecovered ? (
              <Favorite fontSize='large' color='primary' />
            ) : (
              <Healing fontSize='large' color='primary' />
            )}
            <Typography component='h4' variant='h4' py={2}>
              Pokemon Center
            </Typography>
            <Button variant='contained' onClick={() => healPokemon()} disabled={props.isInEncounter || isFullyRecovered} sx={{ width: '160px' }}>
              {props.isInEncounter ? 'In-Battle' : isFullyRecovered ? 'Party is Healthy' : 'Restore Party'}
            </Button>
          </Box>
          <Box className={styles.pokePlaza} mx={2}>
            <SportsMma fontSize='large' color='primary' />
            <Typography component='h4' variant='h4' py={2}>
              Battle Arena
            </Typography>
            <Button variant='contained' onClick={() => handleOpen('Battle Arena')}>
              Battle Trainers
            </Button>
          </Box>
          <Box className={styles.pokePlaza}>
            <LocalFlorist fontSize='large' color='primary' />
            <Typography component='h4' variant='h4' py={2}>
              Day Care
            </Typography>
            <Button variant='contained' onClick={() => handleOpen('Day Care')}>
              Care for Pokemon
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default PokePlaza;
