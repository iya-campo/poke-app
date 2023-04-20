import React, { useState, useEffect } from 'react';
import styles from '@/styles/components/Wilderness.module.scss';
import Zones from './Zones';
import EncounterFrame from './EncounterFrame';
import PartyLeader from './PartyLeader';
import { Container, Box, Button, Typography } from '@mui/material';
import { randomNumberGenerator } from 'utils/Utils';
import myTeam from 'utils/MyTeam';
import pokeBag from 'utils/PokeBag';

function Wilderness(props: any) {
  const [wildPokemons, setWildPokemons]: any = useState([]);
  const [zoneImg, setZoneImg]: any = useState(0);
  const [partyLeader, setPartyLeader]: any = useState(props.team[0]);
  const [selectedBall, setSelectedBall]: any = useState(props.playerItems[0]);
  const [encounter, setEncounter]: any = useState([]);
  const [hasEncounter, setHasEncounter]: any = useState(false);

  useEffect(() => {
    // update states as use state default only sets at render
    if (!selectedBall) setSelectedBall(props.playerItems[0]);
    if (!partyLeader) setPartyLeader(props.team[0]);
  }, [props.playerItems, props.team]);

  const exploreWilds = () => {
    randomEncounter();
  };

  const randomEncounter = () => {
    const num = randomNumberGenerator(0, 30);
    const match = wildPokemons.find((e: any) => e.id === num);
    setEncounter(match);
    setHasEncounter(match ? true : false);
    return match;
  };

  return (
    <Container sx={{ my: 4 }}>
      <Typography component='h2'>Wilderness</Typography>
      <Typography component='span' display='inline-block' pt={2}>{`${selectedBall?.name}: ${selectedBall?.quantity}`}</Typography>
      <Box component='div' display='flex' flexWrap='wrap' my={2}>
        <Box component='div' mr={4}>
          <EncounterFrame
            encounter={encounter}
            hasEncounter={hasEncounter}
            setHasEncounter={setHasEncounter}
            partyLeader={partyLeader}
            setPartyLeader={setPartyLeader}
            team={props.team}
            setTeam={props.setTeam}
            playerItems={props.playerItems}
            setPlayerItems={props.setPlayerItems}
            selectedBall={selectedBall}
            setSelectedBall={setSelectedBall}
            setPCStorage={props.setPCStorage}
          />
          <Box component='div' display='flex'>
            <Button variant='contained' onClick={() => exploreWilds()} sx={{ mr: 3, px: 4 }}>
              Explore
            </Button>
            <PartyLeader team={props.team} partyLeader={partyLeader} setPartyLeader={setPartyLeader} />
          </Box>
        </Box>
        <Box component='div' className={styles.zoneImg} sx={{ backgroundImage: zoneImg }}>
          <Zones setZoneImg={setZoneImg} setWildPokemons={setWildPokemons}></Zones>
        </Box>
      </Box>
    </Container>
  );
}

export default Wilderness;
