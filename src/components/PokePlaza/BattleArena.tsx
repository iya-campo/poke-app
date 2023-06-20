import React, { useState, useEffect } from 'react';
import styles from '@/styles/components/BattleArena.module.scss';
import { Box, Button, Typography, Divider, IconButton } from '@mui/material';
import { Casino } from '@mui/icons-material';
import { randomNumberGenerator, checkTeamStats, determineSuccess } from '@/utils/Utils';

function BattleArena(props: any) {
  const [difficulty, setDifficulty] = useState('');
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
  const HIGH_TIER = 75;
  const LOW_TIER = 40;

  useEffect(() => {
    shuffleTrainer();
  }, []);

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
      case 'Normal':
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

    receiveRewards(reward);

    props.setOpenAlerts({
      isOpen: true,
      msg: matchWon ? `You won! You received a ${reward.name}.` : 'You lost... :(',
    });
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
  };

  const shuffleTrainer = () => {
    const randomTeamLength: number = randomNumberGenerator(1, 6);
    const randomTeam: any = [];

    for (let i = 0; i < randomTeamLength; i++) {
      let randomId = randomNumberGenerator(1, props.pokemonList.length);
      randomTeam.push(props.pokemonList.find((randomPokemon: any) => randomPokemon.id === randomId));
    }

    setDifficulty(props.pokemonList ? identifyDifficulty(randomTeam) : '');

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
      return 'Normal';
    }
    if (checkTeamStats(team) <= LOW_TIER) {
      return 'Easy';
    }
    return '';
  };

  return (
    <Box component='div' className={styles.battleArenaModal}>
      <Box display='flex' justifyContent='space-between' pb={1}>
        <Typography component='h2' variant='h2' p={0}>
          Battle Arena
        </Typography>
        <IconButton color='primary' aria-label='shuffle trainer' component='label' sx={{ p: 0 }} onClick={shuffleTrainer}>
          <Casino />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box component='div' display='flex' justifyContent={!props.isMobile ? 'space-between' : 'center'} flexWrap='wrap' rowGap={2}>
        <Box display='flex' flexDirection='column' mx={3} className={styles.trainerPanel}>
          <Box className={styles.trainerImg} sx={{ backgroundImage: `url('/images/trainer.png')` }} />
          <Box textAlign='center' pt={2}>
            <Typography component='h4' variant='h4' display='inline-block'>{`Difficulty:`}</Typography>
            <Typography
              component='span'
              display='inline-block'
              pl={0.5}
              sx={{ color: difficulty === 'Easy' ? '#5ad12e' : difficulty === 'Normal' ? '#ff9c00' : difficulty === 'Hard' ? '#d83527' : '#000' }}
            >
              {difficulty}
            </Typography>
          </Box>
        </Box>
        <Box display='flex' alignItems='center' justifyContent='space-between' flexDirection='column' className={styles.battlePanel}>
          <Box component='div' display='flex' justifyContent='center' flexWrap='wrap' width={250}>
            {trainer.team.length > 0 &&
              trainer.team.map((pokemon: any, index: number) => (
                <Box
                  key={index}
                  component='div'
                  className={styles.pokemonImg}
                  sx={{
                    backgroundImage: `url(${pokemon?.sprites.front_default})`,
                  }}
                />
              ))}
          </Box>
          <Box component='div' display='flex' flexDirection='column' pt={2}>
            <Typography component='h4' textAlign='center' pb={2}>
              Trainer {trainer.name} wants to battle!
            </Typography>
            <Button variant='contained' onClick={battleTrainer} fullWidth>
              Battle
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default BattleArena;
