import React, { useState, useEffect } from 'react';
import styles from '@/styles/components/Wilderness.module.scss';
import Zones from './Zones';
import EncounterFrame from './EncounterFrame';
import PartyLeader from './PartyLeader';
import { Container, Box, Button, Typography } from '@mui/material';
import { randomNumberGenerator } from '@/utils/Utils';
import Image from 'next/image';

function Wilderness(props: any) {
  const [wildPokemons, setWildPokemons]: any = useState([]);
  const [zoneImg, setZoneImg]: any = useState(0);
  const [selectedBall, setSelectedBall]: any = useState(props.playerItems[0]);
  const [encounter, setEncounter]: any = useState();

  useEffect(() => {
    // update states as use state default only sets at render
    if (!selectedBall) setSelectedBall(props.playerItems[0]);
    if (!props.partyLeader) props.setPartyLeader(props.team[0]);
  }, [props.playerItems, props.team]);

  const exploreWilds = () => {
    randomEncounter();
  };

  const randomEncounter = () => {
    const num = randomNumberGenerator(0, wildPokemons.length + 5);
    const match = wildPokemons.find((e: any) => e.id === num);
    setEncounter(match);
    return match;
  };

  return (
    <Container sx={{ my: 4 }}>
      <Typography component='h2' variant='h2'>
        Wilderness
      </Typography>
      <Box component='div' pt={2}>
        <Typography component='h4' variant='h4' display='inline-block'>{`${selectedBall?.name}s Left:`}</Typography>
        <Typography component='span' display='inline-block' pl={1}>{`${selectedBall?.quantity}`}</Typography>
      </Box>
      <Box component='div' display='flex' flexDirection='column' flexWrap='wrap-reverse' my={2} gap={3}>
        <Box component='div' className={styles.zoneImg} sx={zoneImg ? { backgroundImage: zoneImg } : { backgroundColor: '#ddd' }}>
          <Zones pokemonList={props.pokemonList} setZoneImg={setZoneImg} setWildPokemons={setWildPokemons}></Zones>
        </Box>
        <Box component='div' display='flex' flexWrap='wrap-reverse' rowGap={3} columnGap={5}>
          <Box component='div' display='flex' columnGap={2} flexGrow={1}>
            <Button variant='contained' onClick={() => exploreWilds()} sx={{ display: 'flex', flexDirection: 'column', px: 5 }}>
              <Image alt={`${props.partyLeader?.name} icon`} width={40} height={40} src={props.partyLeader?.img} style={{ marginBottom: 10 }} />
              Explore
            </Button>
            <PartyLeader team={props.team} partyLeader={props.partyLeader} setPartyLeader={props.setPartyLeader} />
          </Box>
          <EncounterFrame
            selectedBall={selectedBall}
            setSelectedBall={setSelectedBall}
            encounter={encounter}
            setEncounter={setEncounter}
            team={props.team}
            setTeam={props.setTeam}
            playerItems={props.playerItems}
            setPlayerItems={props.setPlayerItems}
            partyLeader={props.partyLeader}
            setPartyLeader={props.setPartyLeader}
            isInEncounter={props.isInEncounter}
            setIsInEncounter={props.setIsInEncounter}
            setPCStorage={props.setPCStorage}
            setOpenAlerts={props.setOpenAlerts}
          />
        </Box>
      </Box>
    </Container>
  );
}

export default Wilderness;
