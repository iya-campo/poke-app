import React, { useState, useEffect } from 'react';
import styles from '@/styles/components/BattleArena.module.scss';
import { Box, Button, Typography, Divider, IconButton } from '@mui/material';
import { Casino } from '@mui/icons-material';
import { randomNumberGenerator, checkTeamStats, determineSuccess } from 'utils/Utils';
import PokemonAPI from '@/pages/api/PokemonAPI';

function BattleArena(props: any) {
  const [difficulty, setDifficulty] = useState('');
  const [randomPokemons, setRandomPokemons] = useState([]);
  const [trainer, setTrainer] = useState({
    name: 'Miku',
    team: [],
  });

  const REWARDS_LIST = [
    {
      id: 4,
      name: 'Stardust',
      type: 'Valuable',
      quantity: 1,
      icon: '',
    },
    {
      id: 5,
      name: 'Nugget',
      type: 'Valuable',
      quantity: 1,
      icon: '',
    },
    {
      id: 6,
      name: 'Comet Shard',
      type: 'Valuable',
      quantity: 1,
      icon: '',
    },
  ];

  // team stat avg tiers
  const HIGH_TIER = 60;
  const LOW_TIER = 30;

  useEffect(() => {
    let list: any = [];
    PokemonAPI.fetchPokemon()
      .then((res) => {
        res.results.map((e: any) => {
          fetch(e.url)
            .then((res) => res.json())
            .then((res) => {
              list = [...list, res];
              setRandomPokemons(list);
            });
        });
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (randomPokemons.length > 0) shuffleTrainer();
  }, [randomPokemons]);

  const battleTrainer = () => {
    concludeBattle();
    shuffleTrainer();
  };

  const concludeBattle = () => {
    let matchWon: boolean = false;
    let reward: any = {};

    switch (difficulty) {
      case 'Easy':
        matchWon = determineSuccess(80);
        reward = REWARDS_LIST[0];
        break;
      case 'Moderate':
        matchWon = determineSuccess(50);
        reward = REWARDS_LIST[1];
        break;
      case 'Hard':
        matchWon = determineSuccess(25);
        reward = REWARDS_LIST[2];
        break;
      default:
        matchWon = false;
    }

    if (matchWon) {
      receiveRewards(reward);
      console.log(matchWon ? `You won! You received a ${reward.name}.` : 'You lost... :(');
    }
  };

  const receiveRewards = (reward: any) => {
    const existingValuable = props.playerItems?.find((playerItem: any) => playerItem.id === reward.id);

    if (existingValuable) {
      props.playerItems.map((playerItem: any) => {
        if (playerItem.id === existingValuable.id) {
          playerItem.quantity += 1;
        }
      });
    } else {
      props.setPlayerItems((prevState: any) => [...prevState, reward]);
    }

    console.log(props.playerItems);
  };

  const shuffleTrainer = () => {
    const randomTeamLength: number = randomNumberGenerator(1, 4);
    const randomTeam: any = [];

    for (let i = 0; i < randomTeamLength; i++) {
      let randomId = randomNumberGenerator(1, randomPokemons.length);
      randomTeam.push(randomPokemons.find((randomPokemon: any) => randomPokemon.id === randomId));
    }

    setDifficulty(randomPokemons ? identifyDifficulty(randomTeam) : '');

    setTrainer({
      name: 'Miku',
      team: randomTeam,
    });
  };

  const identifyDifficulty = (team: any) => {
    if (checkTeamStats(team) >= HIGH_TIER) {
      return 'Hard';
    }
    if (checkTeamStats(team) > LOW_TIER && checkTeamStats(team) < HIGH_TIER) {
      return 'Moderate';
    }
    if (checkTeamStats(team) <= LOW_TIER) {
      return 'Easy';
    }
    return '';
  };

  return (
    <Box component='div'>
      <Box display='flex' justifyContent='space-between' pb={1}>
        <Typography component='h2'>Battle Arena</Typography>
        <IconButton color='primary' aria-label='shuffle trainer' component='label' sx={{ p: 0 }} onClick={shuffleTrainer}>
          <Casino />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box display='flex' flexWrap='wrap'>
        <Box mr={2} flexGrow={1} className={styles.trainerImg} sx={{ backgroundImage: `url('/images/trainer.png')` }}></Box>
        <Box display='flex' flexGrow={1} flexDirection='column' justifyContent='center' width='100px'>
          <Box component='div' display='flex' justifyContent='center'>
            {trainer.team.length > 0 &&
              trainer.team.map((pokemon: any, index: number) => (
                <Box
                  key={index}
                  component='div'
                  width='50px'
                  height='50px'
                  className={styles.pokemonImg}
                  sx={{
                    backgroundImage: `url(${pokemon.sprites.front_default})`,
                  }}
                ></Box>
              ))}
          </Box>
          <Typography component='h4' textAlign='center' pt={2}>
            {trainer.name} wants to battle!
          </Typography>
          <Typography component='span' textAlign='center' pb={2}>
            ({difficulty})
          </Typography>
          <Button variant='contained' onClick={battleTrainer}>
            Battle
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default BattleArena;
