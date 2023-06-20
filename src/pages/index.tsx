import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import GlobalHeader from '@/shared/components/GlobalHeader';
import Alerts from '@/shared/components/Alerts';
import Greetings from '@/components/Greetings/Greetings';
import Pokedex from '@/components/Pokedex/Pokedex';
import Wilderness from '@/components/Wilderness/Wilderness';
import MyTeam from '@/components/MyTeam/MyTeam';
import PokeMart from '@/components/PokeMart/PokeMart';
import PokePlaza from '@/components/PokePlaza/PokePlaza';
import { ThemeProvider } from '@emotion/react';
import { pokemonTheme } from '@/themes/PokemonTheme';
import player from '@/data/Player';
import pokeBag from '@/data/PokeBag';
import myTeam from '@/data/MyTeam';
import '../styles/index.module.scss';
import PokemonAPI from '@/api/PokemonAPI';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [playerInfo, setPlayerInfo]: any = useState([]);
  const [playerItems, setPlayerItems]: any = useState([]);
  const [team, setTeam]: any = useState([]);
  const [pcStorage, setPCStorage]: any = useState([]);
  const [partyLeader, setPartyLeader]: any = useState(team[0]);

  const [pokemonList, setPokemonList]: any = useState([]);
  const [openAlert, setOpenAlerts]: any = useState({ isOpen: false, msg: '' });
  const [isInEncounter, setIsInEncounter]: any = useState(false);

  const [isMobile, setIsMobile]: any = useState(false);

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
        types: ['Grass', 'Poison'],
        affection: 10,
        hp: 45,
        maxHp: 45,
        level: 1,
        currentExp: 150,
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
        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif',
      },
      {
        id: 16,
        order: 1,
        name: 'Pidgey',
        types: ['Normal', 'Flying'],
        affection: 0,
        hp: 40,
        maxHp: 40,
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
        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/16.gif',
      },
      {
        id: 16,
        order: 1,
        name: 'Pidgey',
        types: ['Normal', 'Flying'],
        affection: 0,
        hp: 40,
        maxHp: 40,
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
        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/16.gif',
      },
    ]);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  });

  const handleResize = () => {
    if (window.innerWidth <= 767) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    let list: any = [];
    PokemonAPI.fetchPokemon().then((res) => {
      res.results.map((e: any) => {
        fetch(e.url)
          .then((res) => res.json())
          .then((res) => {
            list = [...list, res];
          })
          .then((res) => {
            setPokemonList(list);
          })
          .catch((err) => console.log(err));
      });
    });
  }, []);

  return (
    <ThemeProvider theme={pokemonTheme}>
      <GlobalHeader />
      <Alerts openAlert={openAlert} setOpenAlerts={setOpenAlerts} />
      <Greetings playerInfo={playerInfo} />
      <Pokedex pokemonList={pokemonList} isMobile={isMobile} />
      <Wilderness
        team={team}
        setTeam={setTeam}
        playerItems={playerItems}
        setPlayerItems={setPlayerItems}
        setPCStorage={setPCStorage}
        partyLeader={partyLeader}
        setPartyLeader={setPartyLeader}
        setOpenAlerts={setOpenAlerts}
        setIsInEncounter={setIsInEncounter}
        pokemonList={pokemonList}
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
        isMobile={isMobile}
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
        setOpenAlerts={setOpenAlerts}
        isInEncounter={isInEncounter}
        pokemonList={pokemonList}
        isMobile={isMobile}
      />
    </ThemeProvider>
  );
}
