import React, { useState, useEffect, Dispatch, SetStateAction, useContext } from 'react';
import PokeAppContext from '@/contexts/PokeAppContext';
import { IPokemon, IAlerts } from '@/types/PokeApp';
import CustomModal from '@/shared/components/CustomModal';
import BattleArena from './BattleArena';
import DayCare from './DayCare';
import { Container, Box, Button, Typography } from '@mui/material';
import { Healing, Favorite, Cancel, SportsMma, LocalFlorist } from '@mui/icons-material/';
import styles from '@/styles/components/PokePlaza.module.scss';

interface IPokePlazaContext {
  setOpenAlerts: Dispatch<SetStateAction<IAlerts>>;
  team: IPokemon[];
  partyLeader: IPokemon;
  setPartyLeader: Dispatch<SetStateAction<IPokemon>>;
  isInEncounter: boolean;
}

function PokePlaza() {
  const { team, partyLeader, setPartyLeader, setOpenAlerts, isInEncounter }: IPokePlazaContext = useContext(PokeAppContext);

  const [isFullyRecovered, setIsFullyRecovered] = useState<boolean>(true);
  const [openBattleArena, setOpenBattleArena] = useState<boolean>(false);
  const [openDayCare, setOpenDayCare] = useState<boolean>(false);

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
    setIsFullyRecovered(!team.some((pokemon: IPokemon) => pokemon.hp !== pokemon.maxHp));
  }, [partyLeader]);

  const healPokemon = () => {
    team.map((pokemon: IPokemon) => {
      pokemon.hp = pokemon.maxHp;
    });
    setPartyLeader((prevState: IPokemon) => ({ ...prevState, hp: prevState.maxHp }));
    setOpenAlerts({
      isOpen: true,
      msg: 'Your Pokemon is fully recovered!',
    });
  };

  return (
    <>
      <CustomModal open={openBattleArena} setOpen={setOpenBattleArena} component={<BattleArena />} />
      <CustomModal open={openDayCare} setOpen={setOpenDayCare} component={<DayCare />} />
      <Container sx={{ my: 4 }}>
        <Typography component='h2' variant='h2'>
          Poke Plaza
        </Typography>
        <Box component='div' display='flex' justifyContent='space-between' flexWrap='wrap' my={2}>
          <Box className={styles.pokePlaza}>
            {isInEncounter ? (
              <Cancel fontSize='large' color='primary' />
            ) : isFullyRecovered ? (
              <Favorite fontSize='large' color='primary' />
            ) : (
              <Healing fontSize='large' color='primary' />
            )}
            <Typography component='h4' variant='h4' py={2}>
              Pokemon Center
            </Typography>
            <Button variant='contained' onClick={() => healPokemon()} disabled={isInEncounter || isFullyRecovered} sx={{ width: '160px' }}>
              {isInEncounter ? 'In-Battle' : isFullyRecovered ? 'Party is Healthy' : 'Restore Party'}
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
