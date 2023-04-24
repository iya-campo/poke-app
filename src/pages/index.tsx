import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import GlobalHeader from '@/components/GlobalHeader';
import Pokedex from '@/components/Pokedex/Pokedex';
import Wilderness from '@/components/Wilderness/Wilderness';
import MyTeam from '@/components/MyTeam/MyTeam';
import PokeMart from '@/components/PokeMart/PokeMart';
import PokePlaza from '@/components/PokePlaza/PokePlaza';
import { ThemeProvider } from '@emotion/react';
import { pokemonTheme } from 'themes/PokemonTheme';
import player from 'utils/Player';
import pokeBag from 'utils/PokeBag';
import myTeam from 'utils/MyTeam';
import '../styles/index.module.scss';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [playerInfo, setPlayerInfo]: any = useState([]);
  const [playerItems, setPlayerItems]: any = useState([]);
  const [team, setTeam]: any = useState([]);
  const [pcStorage, setPCStorage]: any = useState([]);
  const [partyLeader, setPartyLeader]: any = useState(team[0]);

  useEffect(() => {
    // set initial
    setPlayerInfo(player);
    setPlayerItems(pokeBag);
    setTeam(myTeam);
    setPCStorage([
      {
        id: 1,
        order: 0,
        name: 'Bulbasaur',
        hp: 45,
        maxHp: 45,
        base_experience: 64,
        level: 1,
        currentExp: 0,
        expNeeded: 200,
        stats: [
          {
            name: 'hp',
            base_stat: 45,
          },
          {
            name: 'attack',
            base_stat: 62,
          },
          {
            name: 'defense',
            base_stat: 63,
          },
          {
            name: 'special-attack',
            base_stat: 80,
          },
          {
            name: 'special-defense',
            base_stat: 80,
          },
          {
            name: 'speed',
            base_stat: 60,
          },
        ],
      },
      {
        id: 1,
        order: 0,
        name: 'Bulbasaur',
        hp: 45,
        maxHp: 45,
        base_experience: 64,
        level: 1,
        currentExp: 0,
        expNeeded: 200,
        stats: [
          {
            name: 'hp',
            base_stat: 45,
          },
          {
            name: 'attack',
            base_stat: 62,
          },
          {
            name: 'defense',
            base_stat: 63,
          },
          {
            name: 'special-attack',
            base_stat: 80,
          },
          {
            name: 'special-defense',
            base_stat: 80,
          },
          {
            name: 'speed',
            base_stat: 60,
          },
        ],
      },
      {
        id: 16,
        order: 1,
        name: 'Pidgey',
        hp: 40,
        maxHp: 40,
        base_experience: 50,
        level: 1,
        currentExp: 0,
        expNeeded: 100,
        stats: [
          {
            name: 'hp',
            base_stat: 40,
          },
          {
            name: 'attack',
            base_stat: 62,
          },
          {
            name: 'defense',
            base_stat: 63,
          },
          {
            name: 'special-attack',
            base_stat: 80,
          },
          {
            name: 'special-defense',
            base_stat: 80,
          },
          {
            name: 'speed',
            base_stat: 60,
          },
        ],
      },
    ]);
  }, []);

  return (
    <ThemeProvider theme={pokemonTheme}>
      <GlobalHeader />
      <Pokedex />
      <Wilderness
        team={team}
        setTeam={setTeam}
        playerItems={playerItems}
        setPlayerItems={setPlayerItems}
        setPCStorage={setPCStorage}
        partyLeader={partyLeader}
        setPartyLeader={setPartyLeader}
      />
      <MyTeam
        team={team}
        setTeam={setTeam}
        pcStorage={pcStorage}
        setPCStorage={setPCStorage}
        partyLeader={partyLeader}
        setPartyLeader={setPartyLeader}
      />
      <PokeMart
        playerInfo={playerInfo}
        setPlayerInfo={setPlayerInfo}
        playerItems={playerItems}
        setPlayerItems={setPlayerItems}
        pcStorage={pcStorage}
        setPCStorage={setPCStorage}
      />
      <PokePlaza
        playerInfo={playerInfo}
        setPlayerInfo={setPlayerInfo}
        playerItems={playerItems}
        setPlayerItems={setPlayerItems}
        team={team}
        setTeam={setTeam}
        partyLeader={partyLeader}
        setPartyLeader={setPartyLeader}
      />
    </ThemeProvider>
  );
}
