import React, { useState, useEffect, Dispatch, SetStateAction, useContext } from 'react';
import PokeAppContext from '@/contexts/PokeAppContext';
import { IItem, IPokemon, IPokemonData } from '@/types/PokeApp';
import Zones from './Zones';
import PartyLeader from './PartyLeader';
import EncounterFrame from './EncounterFrame';
import { Container, Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import styles from '@/styles/components/Wilderness.module.scss';
import { randomNumberGenerator } from '@/utils/Utils';
import { POKEMON_TOTAL } from '@/utils/Constants';

interface IWildernessContext {
  playerItems: IItem[];
  team: IPokemon[];
  partyLeader: IPokemon;
  setPartyLeader: Dispatch<SetStateAction<IPokemon>>;
}

function Wilderness() {
  const { playerItems, team, partyLeader, setPartyLeader }: IWildernessContext = useContext(PokeAppContext);

  const [wildPokemons, setWildPokemons] = useState<IPokemonData[]>();
  const [zoneImg, setZoneImg] = useState<string>('');
  const [encounter, setEncounter] = useState<IPokemonData>();

  const [selectedBall, setSelectedBall] = useState<IItem>(playerItems[0]);

  useEffect(() => {
    // update states as use state default only sets at render
    if (!selectedBall) setSelectedBall(playerItems[0]);
    if (!partyLeader) setPartyLeader(team[0]);
  }, [playerItems, team]);

  const exploreWilds = () => {
    randomEncounter();
  };

  const randomEncounter = () => {
    const num: number = randomNumberGenerator(0, POKEMON_TOTAL);
    const match: IPokemonData = wildPokemons.find((wildPokemon: IPokemonData) => wildPokemon.id === num);
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
        <Typography component='span' display='inline-block' pl={1}>{`${selectedBall?.qty}`}</Typography>
      </Box>
      <Box component='div' display='flex' flexDirection='column' flexWrap='wrap-reverse' my={2} gap={3}>
        <Box component='div' className={styles.zoneImg} sx={zoneImg ? { backgroundImage: zoneImg } : { backgroundColor: '#ddd' }}>
          <Zones setZoneImg={setZoneImg} setWildPokemons={setWildPokemons}></Zones>
        </Box>
        <Box component='div' display='flex' flexWrap='wrap-reverse' rowGap={3} columnGap={5}>
          <Box component='div' display='flex' columnGap={2} flexGrow={1}>
            <Button variant='contained' onClick={() => exploreWilds()} sx={{ display: 'flex', flexDirection: 'column', px: 5 }}>
              <Image alt={`${partyLeader?.name} icon`} width={40} height={40} src={partyLeader?.img} style={{ marginBottom: 10 }} />
              Explore
            </Button>
            <PartyLeader />
          </Box>
          <EncounterFrame selectedBall={selectedBall} setSelectedBall={setSelectedBall} encounter={encounter} />
        </Box>
      </Box>
    </Container>
  );
}

export default Wilderness;
