import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import GlobalHeader from '@/components/GlobalHeader';
import Pokedex from '@/components/Pokedex/Pokedex';
import Wilderness from '@/components/Wilderness/Wilderness';
import MyTeam from '@/components/MyTeam/MyTeam';
import PokeMart from '@/components/PokeMart/PokeMart';
import PokemonCenter from '@/components/PokemonCenter/PokemonCenter';
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

  useEffect(() => {
    // set initial
    setPlayerInfo(player);
    setPlayerItems(pokeBag);
    setTeam(myTeam);
    setPCStorage([]);
  }, []);

  return (
    <ThemeProvider theme={pokemonTheme}>
      <GlobalHeader />
      <Pokedex />
      <Wilderness team={team} setTeam={setTeam} playerItems={playerItems} setPlayerItems={setPlayerItems} setPCStorage={setPCStorage} />
      <MyTeam team={team} setTeam={setTeam} pcStorage={pcStorage} setPCStorage={setPCStorage} />
      <PokeMart
        playerInfo={playerInfo}
        setPlayerInfo={setPlayerInfo}
        playerItems={playerItems}
        setPlayerItems={setPlayerItems}
        pcStorage={pcStorage}
        setPCStorage={setPCStorage}
      />
      <PokemonCenter playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} team={team} setTeam={setTeam} />
    </ThemeProvider>
  );
}
