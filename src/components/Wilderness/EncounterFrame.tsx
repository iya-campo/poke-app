import React, { useState, useEffect } from 'react';
import { ArrowDropDown } from '@mui/icons-material';
import { Box, Button, ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, Typography } from '@mui/material';
import { capitalize, randomNumberGenerator, replaceAll, getTypes, checkPokemonStats } from 'utils/Utils';

function EncounterFrame(props: any) {
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const [disableCatch, setDisableCatch] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [catchMsg, setCatchMsg] = useState('');

  const ballOptions = props.playerItems.filter((playerItem: any) => playerItem.type === 'Ball');

  // pokemon stat avg tiers
  const HIGH_TIER = 75;
  const LOW_TIER = 50;

  useEffect(() => {
    // reset message and attempt count for every new encounter
    setCatchMsg('');
    setAttemptCount(0);
    setDisableCatch(false);
  }, [props.encounter]);

  useEffect(() => {
    // find party leader in the team
    // set newly deducted hp
    // set newly gained exp and lvl
    const partyLeader = props.team.find((pokemon: any) => pokemon.order === props.partyLeader?.order);
    if (partyLeader) {
      partyLeader.hp = props.partyLeader.hp;
      partyLeader.currentExp = props.partyLeader.currentExp;
      partyLeader.expNeeded = props.partyLeader.expNeeded;
      partyLeader.level = props.partyLeader.level;
    }

    props.setTeam((prevState: any) => [...prevState]);
  }, [props.partyLeader]);

  const damagePokemon = () => {
    // improve to vary damage according to opponent
    // prevent health from dipping lower than zero
    const sustainedDamage: number = 10;
    const affectionBuff: number = props.partyLeader.affection > 0 ? props.partyLeader.affection / 10 : 0;
    let totalDamageSustained = sustainedDamage - affectionBuff;

    props.setPartyLeader((prevState: any) => ({ ...prevState, hp: prevState.hp - sustainedDamage >= 0 ? prevState.hp - totalDamageSustained : 0 }));
  };

  const gainExp = () => {
    const wildPokemonStats = props.encounter.stats;
    let expGained = 0;

    if (checkPokemonStats(wildPokemonStats) >= HIGH_TIER) {
      expGained = 200;
    }
    if (checkPokemonStats(wildPokemonStats) > LOW_TIER && checkPokemonStats(wildPokemonStats) < HIGH_TIER) {
      expGained = 100;
    }
    if (checkPokemonStats(wildPokemonStats) <= LOW_TIER) {
      expGained = 50;
    }

    props.setPartyLeader((prevState: any) => {
      let updatedPokemon = { ...prevState, currentExp: prevState.currentExp + expGained };
      if (updatedPokemon.currentExp >= updatedPokemon.expNeeded) {
        // if pokemon's current exp after battle reaches exp needed
        // increase exp needed and level up by 1
        updatedPokemon = {
          ...prevState,
          currentExp: prevState.currentExp + expGained,
          expNeeded: prevState.expNeeded * 2,
          level: (prevState.level += 1),
        };
      }
      return updatedPokemon;
    });
  };

  const deductPokeBalls = (ballId: number) => {
    const ballUsed = props.playerItems.find((playerItem: any) => playerItem.id === ballId);
    ballUsed.quantity -= 1;
  };

  const changeSelectedBall = (e: any, index: number) => {
    const ballSelected = props.playerItems.find((ball: any) => ball.id === e.target.value);
    props.setSelectedBall(ballSelected);
    setSelectedIndex(index);
    setOpen(false);
  };

  const attemptCatch = (selectedBall: any) => {
    let hasBattleEnded,
      hasPokemonEscaped = false;

    if (selectedBall?.quantity <= 0 || props.partyLeader?.hp <= 0) {
      return;
    }

    if (attemptCount > 3) {
      hasPokemonEscaped = randomNumberGenerator(0, 100) % 10 === 0 ? true : false;
      if (hasPokemonEscaped) {
        const fleeMsg = replaceAll('POKEMON ran away...', { POKEMON: capitalize(props.encounter?.name) });
        setCatchMsg(fleeMsg);
        setAttemptCount(0);
        setDisableCatch(true);
        return;
      }
    }

    switch (selectedBall?.name) {
      case 'Poke Ball':
        hasBattleEnded = randomNumberGenerator(0, 100) % 5 === 0 ? true : false;
        break;
      case 'Great Ball':
        hasBattleEnded = randomNumberGenerator(0, 100) % 4 === 0 ? true : false;
        break;
      case 'Super Ball':
        hasBattleEnded = randomNumberGenerator(0, 100) % 3 === 0 ? true : false;
        break;
      case 'Ultra Ball':
        hasBattleEnded = randomNumberGenerator(0, 100) % 2 === 0 ? true : false;
        break;
      default:
      // set default here.
    }

    if (hasBattleEnded) {
      const successMsg = replaceAll('Success! You caught POKEMON.', { POKEMON: capitalize(props.encounter?.name) });
      props.setPCStorage((prevState: any) => [
        {
          id: props.encounter.id,
          order: props.team.length,
          name: capitalize(props.encounter.name),
          types: getTypes(props.encounter.types),
          affection: 0,
          hp: props.encounter.stats[0].base_stat,
          maxHp: props.encounter.stats[0].base_stat,
          level: 0,
          currentExp: props.encounter.base_experience,
          expNeeded: props.encounter.base_experience * 2,
          stats: [
            {
              name: 'hp',
              base_stat: props.encounter.stats[0].base_stat,
            },
            {
              name: 'attack',
              base_stat: props.encounter.stats[1].base_stat,
            },
            {
              name: 'defense',
              base_stat: props.encounter.stats[2].base_stat,
            },
            {
              name: 'special-attack',
              base_stat: props.encounter.stats[3].base_stat,
            },
            {
              name: 'special-defense',
              base_stat: props.encounter.stats[4].base_stat,
            },
            {
              name: 'speed',
              base_stat: props.encounter.stats[5].base_stat,
            },
          ],
          img: props.encounter.sprites.versions['generation-v']['black-white'].animated.front_default,
        },
        ...prevState,
      ]);
      setCatchMsg(successMsg);
      setAttemptCount(0);
      setDisableCatch(true);
      gainExp();
    } else {
      setAttemptCount((prevState) => {
        const failMsg = replaceAll('Oh no! POKEMON broke free.\nCatch attempts: COUNT', {
          POKEMON: capitalize(props.encounter?.name),
          COUNT: prevState + 1,
        });
        setCatchMsg(failMsg);
        return (prevState = prevState + 1);
      });
    }

    deductPokeBalls(selectedBall?.id);
    damagePokemon();
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  return (
    <Box my={2}>
      {props.hasEncounter ? (
        <Box component='div' mb={4}>
          <Box component='div' mb={2}>
            <Typography component='span'>{`Encountered a wild ${capitalize(props.encounter?.name)}!`}</Typography>
          </Box>
          <Box component='div' display='flex' alignContent={'center'}>
            <Box component='div'>
              <ButtonGroup variant='contained' ref={anchorRef} aria-label='split button' sx={{ height: '50px' }}>
                <Button
                  onClick={() => attemptCatch(props.selectedBall)}
                  disabled={disableCatch || props.selectedBall?.quantity <= 0 || props.partyLeader?.hp <= 0}
                >
                  {ballOptions[selectedIndex].name}
                </Button>
                <Button
                  size='small'
                  aria-controls={open ? 'split-button-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-label='select merge strategy'
                  aria-haspopup='menu'
                  onClick={handleToggle}
                >
                  <ArrowDropDown />
                </Button>
              </ButtonGroup>
              <Popper
                sx={{
                  zIndex: 1,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id='split-button-menu' autoFocusItem>
                          {ballOptions.map((option: any, index: number) => (
                            <MenuItem
                              key={index}
                              selected={index === selectedIndex}
                              disabled={option.quantity <= 0}
                              onClick={(e) => changeSelectedBall(e, index)}
                              value={option.id}
                            >
                              {option.name}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Box>
            <Typography sx={{ ml: 2, alignSelf: 'center', width: '200px' }}>
              {props.selectedBall?.quantity > 0 && props.partyLeader?.hp > 0
                ? catchMsg
                : props.partyLeader?.hp > 0
                ? `You're out of ${props.selectedBall?.name}s!`
                : 'Your Pokemon has fainted!'}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box component='div' mb={4}>
          <Typography component='span'>No wild Pokemon in sight.</Typography>
        </Box>
      )}
    </Box>
  );
}

export default EncounterFrame;
