import React, { useEffect, useState } from 'react';
import { Inter } from '@next/font/google';
import GlobalHeader from '@/shared/components/GlobalHeader';
import PokemonAPI from '@/api/PokemonAPI';
import PokeAppContext from '@/contexts/PokeAppContext';
import { IAlerts, IItem, IPlayer, IPokemon } from '@/types/PokeApp';
import Alerts from '@/shared/components/Alerts';
import Greetings from '@/components/Greetings/Greetings';
import Pokedex from '@/components/Pokedex/Pokedex';
import Wilderness from '@/components/Wilderness/Wilderness';
import MyTeam from '@/components/MyTeam/MyTeam';
import PokeMart from '@/components/PokeMart/PokeMart';
import PokePlaza from '@/components/PokePlaza/PokePlaza';
import { ThemeProvider } from '@emotion/react';
import { pokemonTheme } from '@/themes/PokemonTheme';
import '../styles/index.module.scss';
import player from '@/data/Player';
import pokeBag from '@/data/PokeBag';
import myTeam from '@/data/MyTeam';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [playerInfo, setPlayerInfo] = useState<IPlayer>(player);
  const [playerItems, setPlayerItems] = useState<IItem[]>(pokeBag);
  const [team, setTeam] = useState<IPokemon[]>(myTeam);
  const [pcStorage, setPCStorage] = useState<IPokemon[]>([]);
  const [partyLeader, setPartyLeader] = useState<IPokemon>(team[0]);

  const [pokemonList, setPokemonList] = useState<any>([]);
  const [openAlert, setOpenAlerts] = useState<IAlerts>({ isOpen: false, msg: '' });
  const [isInEncounter, setIsInEncounter] = useState<boolean>(false);

  const [isMobile, setIsMobile] = useState<boolean>(false);

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
    let list: IPokemon[] = [];
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
    <PokeAppContext.Provider
      value={{
        playerInfo,
        setPlayerInfo,
        team,
        setTeam,
        playerItems,
        setPlayerItems,
        partyLeader,
        setPartyLeader,
        pcStorage,
        setPCStorage,
        isInEncounter,
        setIsInEncounter,
        pokemonList,
        setOpenAlerts,
        isMobile,
      }}
    >
      <ThemeProvider theme={pokemonTheme}>
        <GlobalHeader />
        <Alerts openAlert={openAlert} />
        <Greetings />
        <Pokedex />
        <Wilderness />
        <MyTeam />
        <PokeMart />
        <PokePlaza />
      </ThemeProvider>
    </PokeAppContext.Provider>
  );
}
