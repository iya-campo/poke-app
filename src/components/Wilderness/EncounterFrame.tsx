import React, { useState, useEffect } from 'react';
import { ArrowDropDown } from '@mui/icons-material';
import { Box, Button, ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, Typography } from '@mui/material';
import { capitalize, randomNumberGenerator, getTypes, checkPokemonStats, determineSuccess } from '@/utils/Utils';
import styles from '@/styles/components/EncounterFrame.module.scss';
import Image from 'next/image';

function EncounterFrame(props: any) {
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const [isPartyWipedOut, setIsPartyWipedOut] = useState(false);
  const [disableCatch, setDisableCatch] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [catchMsg, setCatchMsg] = useState('');

  const ballOptions = props.playerItems.filter((playerItem: any) => playerItem.type === 'Ball');

  useEffect(() => {
    // reset message and attempt count for every new encounter
    setCatchMsg('');
    setAttemptCount(0);
    setDisableCatch(false);
    props.setIsInEncounter(false);
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
    // check if all pokemon have fainted
    setIsPartyWipedOut(props.team.every((pokemon: any) => pokemon.hp === 0));
  }, [props.partyLeader]);

  useEffect(() => {
    fleeAttempt();
  }, [attemptCount, isPartyWipedOut]);

  const damagePokemon = () => {
    // varies damage according to opponent's stats
    // prevent health from dipping lower than zero
    const sustainedDamage: number = 2 + checkPokemonStats(props.encounter.stats) / 10;
    const affectionBuff: number = props.partyLeader.affection > 0 ? (sustainedDamage * props.partyLeader.affection) / 100 : 0;
    const totalDamageSustained = Math.trunc(sustainedDamage - affectionBuff);

    props.setPartyLeader((prevState: any) => ({
      ...prevState,
      hp: prevState.hp - totalDamageSustained >= 0 ? prevState.hp - totalDamageSustained : 0,
    }));

    return totalDamageSustained;
  };

  const gainExp = (expGained: number) => {
    if (props.partyLeader.level >= 99) return;
    props.setPartyLeader((prevState: any) => {
      let updatedPokemon = { ...prevState, currentExp: prevState.currentExp + expGained };
      if (updatedPokemon.currentExp >= updatedPokemon.expNeeded) {
        // if pokemon's current exp after battle reaches exp needed
        // increase exp needed and level up by 1
        updatedPokemon = {
          ...prevState,
          currentExp: prevState.currentExp + expGained,
          expNeeded: prevState.expNeeded + 50,
          level: (prevState.level += 1),
          stats: prevState.stats.map((stat: any) => ({ name: stat.name, base_stat: (stat.base_stat += 2) })),
        };
      }
      return updatedPokemon;
    });
  };

  const tossBall = () => {
    const catchDifficulty = checkPokemonStats(props.encounter.stats) / 2;
    let catchResult = false;

    switch (props.selectedBall?.name) {
      case 'Poke Ball':
        catchResult = determineSuccess(60 - catchDifficulty);
      case 'Great Ball':
        catchResult = determineSuccess(70 - catchDifficulty);
      case 'Super Ball':
        catchResult = determineSuccess(80 - catchDifficulty);
      case 'Ultra Ball':
        catchResult = determineSuccess(90 - catchDifficulty);
      default:
      // set default here.
    }
    return catchResult;
  };

  const deductBalls = () => {
    const ballUsed = props.playerItems.find((playerItem: any) => playerItem.id === props.selectedBall?.id);
    ballUsed.quantity -= 1;
  };

  const changeSelectedBall = (e: any, index: number) => {
    const ballSelected = props.playerItems.find((ball: any) => ball.id === e.target.value);
    props.setSelectedBall(ballSelected);
    setSelectedIndex(index);
    setOpen(false);
  };

  const fleeAttempt = () => {
    if (attemptCount > 3 || isPartyWipedOut) {
      const hasPokemonEscaped = randomNumberGenerator(0, 100) % 10 === 0 ? true : false;
      if (hasPokemonEscaped || isPartyWipedOut) {
        const fleeMsg = `${capitalize(props.encounter?.name)} fled...`;
        setCatchMsg(fleeMsg);
        setAttemptCount(0);
        setDisableCatch(true);
        props.setIsInEncounter(false);
        return;
      }
    }
  };

  const catchAttempt = () => {
    if (props.selectedBall?.quantity <= 0 || props.partyLeader?.hp <= 0) return;

    if (props.partyLeader?.hp <= damagePokemon()) return;

    if (tossBall()) {
      const expGained = Math.trunc(checkPokemonStats(props.encounter.stats));
      const successMsg = `Success! You caught ${capitalize(props.encounter.name)}.\n${props.partyLeader.name} ${
        props.partyLeader.hp > 0 ? `gained ${expGained} exp.` : 'did not gain exp.'
      }`;
      setCatchMsg(successMsg);
      props.setPCStorage((prevState: any) => [
        {
          id: props.encounter.id,
          order: props.team.length,
          name: capitalize(props.encounter.name),
          types: getTypes(props.encounter.types),
          affection: 0,
          hp: props.encounter.stats[0].base_stat,
          maxHp: props.encounter.stats[0].base_stat,
          level: 1,
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
      setAttemptCount(0);
      setDisableCatch(true);
      gainExp(expGained);
      props.setIsInEncounter(false);
    } else {
      setAttemptCount((prevState: any) => {
        const catchAttempts = prevState + 1;
        const failMsg = `Oh no! ${capitalize(props.encounter.name)} broke free.\nCatch attempts: ${catchAttempts}`;
        setCatchMsg(failMsg);
        return catchAttempts;
      });
      props.setIsInEncounter(true);
    }

    deductBalls();
  };

  const escapeAttempt = () => {
    const escapeMsg = 'You successfully escaped!';
    setCatchMsg(escapeMsg);
    setAttemptCount(0);
    setDisableCatch(true);
    props.setIsInEncounter(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) return;
    setOpen(false);
  };

  return (
    <Box display='flex' flexGrow={1}>
      {props.encounter ? (
        <Box component='div' display='flex' justifyContent='flex-start' flexGrow={1} columnGap={2}>
          <Box component='div' display='flex' flexDirection='column' rowGap={1}>
            <Box component='div'>
              <ButtonGroup
                variant='contained'
                ref={anchorRef}
                aria-label='split button'
                sx={{ width: '100%' }}
                disabled={
                  disableCatch ||
                  props.partyLeader?.hp <= 0 ||
                  !props.playerItems.some((playerItem: any) => playerItem.type === 'Ball' && playerItem.quantity !== 0)
                }
              >
                <Button onClick={catchAttempt} disabled={props.selectedBall?.quantity <= 0} sx={{ flexGrow: 1 }}>
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
            <Button variant='contained' disabled={!props.isInEncounter} onClick={escapeAttempt}>
              Escape
            </Button>
            <Typography mt={1} textAlign='center' sx={{ alignSelf: 'center' }}>
              {props.selectedBall?.quantity > 0 && props.partyLeader?.hp > 0
                ? ''
                : props.partyLeader?.hp > 0
                ? `You're out of ${props.selectedBall?.name}s!`
                : 'Your Pokemon has fainted!'}
            </Typography>
          </Box>
          <Box component='div' className={styles.encounterDetails}>
            <Typography component='span' display='block' textAlign='center' width={250}>
              {catchMsg ? catchMsg : `Encountered a wild ${capitalize(props.encounter?.name)}!`}
            </Typography>
            <Image
              alt={`${props.encounter?.name} icon`}
              width={50}
              height={50}
              src={props.encounter?.sprites.versions['generation-v']['black-white'].animated.front_default}
            />
          </Box>
        </Box>
      ) : (
        <Box component='div'>
          <Typography component='span' display='block'>
            No wild Pokemon in sight.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default EncounterFrame;
