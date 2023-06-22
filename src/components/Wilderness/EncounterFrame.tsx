import React, { useState, useEffect, Dispatch, SetStateAction, useContext, useRef, MouseEvent } from 'react';
import PokeAppContext from '@/contexts/PokeAppContext';
import { IItem, IPokemon, IPokemonData, IPokemonStats } from '@/types/PokeApp';
import { Box, Button, ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, Typography } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import Image from 'next/image';
import styles from '@/styles/components/EncounterFrame.module.scss';
import { capitalize, randomNumberGenerator, getTypes, checkPokemonStats, determineSuccess } from '@/utils/Utils';

interface IEncounterFrameContext {
  isInEncounter: boolean;
  setIsInEncounter: Dispatch<SetStateAction<boolean>>;
  team: IPokemon[];
  playerItems: IItem[];
  partyLeader: IPokemon;
  setPartyLeader: Dispatch<SetStateAction<IPokemon>>;
  setPCStorage: Dispatch<SetStateAction<IPokemon[]>>;
}

interface IEncounterFrameProps {
  selectedBall: IItem;
  setSelectedBall: Dispatch<SetStateAction<IItem>>;
  encounter: IPokemonData;
}

function EncounterFrame({ selectedBall, setSelectedBall, encounter }: IEncounterFrameProps) {
  const { isInEncounter, setIsInEncounter, team, playerItems, partyLeader, setPartyLeader, setPCStorage }: IEncounterFrameContext =
    useContext(PokeAppContext);

  const [open, setOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const [isPartyWipedOut, setIsPartyWipedOut] = useState<boolean>(false);
  const [disableCatch, setDisableCatch] = useState<boolean>(false);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [catchMsg, setCatchMsg] = useState<string>('');

  const ballOptions: IItem[] = playerItems.filter((playerItem: IItem) => playerItem.type === 'Ball');

  useEffect(() => {
    // reset message and attempt count for every new encounter
    setCatchMsg('');
    setAttemptCount(0);
    setDisableCatch(false);
    setIsInEncounter(false);
  }, [encounter]);

  useEffect(() => {
    // find party leader in the team
    // set newly deducted hp
    // set newly gained exp and lvl
    const partyLeaderPokemon: IPokemon = team.find((pokemon: IPokemon) => pokemon.order === partyLeader?.order);
    if (partyLeader) {
      partyLeaderPokemon.hp = partyLeader.hp;
      partyLeaderPokemon.currentExp = partyLeader.currentExp;
      partyLeaderPokemon.expNeeded = partyLeader.expNeeded;
      partyLeaderPokemon.level = partyLeader.level;
    }
    // check if all pokemon have fainted
    setIsPartyWipedOut(team.every((pokemon: IPokemon) => pokemon.hp === 0));
  }, [partyLeader]);

  useEffect(() => {
    fleeAttempt();
  }, [attemptCount, isPartyWipedOut]);

  const damagePokemon = () => {
    // varies damage according to opponent's stats
    // prevent health from dipping lower than zero
    const sustainedDamage: number = 2 + checkPokemonStats(encounter.stats) / 10;
    const affectionBuff: number = partyLeader.affection > 0 ? (sustainedDamage * partyLeader.affection) / 100 : 0;
    const totalDamageSustained: number = Math.trunc(sustainedDamage - affectionBuff);

    setPartyLeader((prevState: IPokemon) => ({
      ...prevState,
      hp: prevState.hp - totalDamageSustained >= 0 ? prevState.hp - totalDamageSustained : 0,
    }));

    return totalDamageSustained;
  };

  const gainExp = (expGained: number) => {
    if (partyLeader.level >= 99) return;
    setPartyLeader((prevState: IPokemon) => {
      let updatedPokemon: IPokemon = { ...prevState, currentExp: prevState.currentExp + expGained };
      if (updatedPokemon.currentExp >= updatedPokemon.expNeeded) {
        // if pokemon's current exp after battle reaches exp needed
        // increase exp needed and level up by 1
        updatedPokemon = {
          ...prevState,
          currentExp: prevState.currentExp + expGained,
          expNeeded: prevState.expNeeded + 50,
          level: (prevState.level += 1),
          stats: prevState.stats.map((stat: IPokemonStats) => ({ name: stat.name, base_stat: (stat.base_stat += 2) })),
        };
      }
      return updatedPokemon;
    });
  };

  const tossBall = () => {
    const catchDifficulty: number = checkPokemonStats(encounter.stats) / 2;
    let catchResult: boolean = false;

    switch (selectedBall?.name) {
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
    const ballUsed: IItem = playerItems.find((playerItem: IItem) => playerItem.id === selectedBall?.id);
    ballUsed.qty -= 1;
  };

  const changeSelectedBall = (event: MouseEvent<HTMLLIElement>, index: number) => {
    const ballSelected = playerItems.find((ball: IItem) => ball.id === event.currentTarget.value);
    setSelectedBall(ballSelected);
    setSelectedIndex(index);
    setOpen(false);
  };

  const fleeAttempt = () => {
    if (attemptCount > 3 || isPartyWipedOut) {
      const hasPokemonEscaped: boolean = randomNumberGenerator(0, 100) % 10 === 0 ? true : false;
      if (hasPokemonEscaped || isPartyWipedOut) {
        const fleeMsg: string = `${capitalize(encounter?.name)} fled...`;
        setCatchMsg(fleeMsg);
        setAttemptCount(0);
        setDisableCatch(true);
        setIsInEncounter(false);
        return;
      }
    }
  };

  const catchAttempt = () => {
    if (selectedBall?.qty <= 0 || partyLeader?.hp <= 0) return;

    if (partyLeader?.hp <= damagePokemon()) return;

    if (tossBall()) {
      const expGained: number = Math.trunc(checkPokemonStats(encounter.stats));
      const successMsg: string = `Success! You caught ${capitalize(encounter.name)}.\n${partyLeader.name} ${
        partyLeader.hp > 0 ? `gained ${expGained} exp.` : 'did not gain exp.'
      }`;
      setCatchMsg(successMsg);
      setPCStorage((prevState: IPokemon[]) => [
        {
          id: encounter.id,
          order: team.length,
          name: capitalize(encounter.name),
          types: getTypes(encounter.types),
          affection: 0,
          hp: encounter.stats[0].base_stat,
          maxHp: encounter.stats[0].base_stat,
          level: 1,
          currentExp: encounter.base_exp,
          expNeeded: encounter.base_exp * 2,
          stats: [
            {
              name: 'hp',
              base_stat: encounter.stats[0].base_stat,
            },
            {
              name: 'attack',
              base_stat: encounter.stats[1].base_stat,
            },
            {
              name: 'defense',
              base_stat: encounter.stats[2].base_stat,
            },
            {
              name: 'special-attack',
              base_stat: encounter.stats[3].base_stat,
            },
            {
              name: 'special-defense',
              base_stat: encounter.stats[4].base_stat,
            },
            {
              name: 'speed',
              base_stat: encounter.stats[5].base_stat,
            },
          ],
          img: encounter.sprites.versions['generation-v']['black-white'].animated.front_default,
        },
        ...prevState,
      ]);
      setAttemptCount(0);
      setDisableCatch(true);
      gainExp(expGained);
      setIsInEncounter(false);
    } else {
      setAttemptCount((prevState: number) => {
        const catchAttempts: number = prevState + 1;
        const failMsg: string = `Oh no! ${capitalize(encounter.name)} broke free.\nCatch attempts: ${catchAttempts}`;
        setCatchMsg(failMsg);
        return catchAttempts;
      });
      setIsInEncounter(true);
    }

    deductBalls();
  };

  const escapeAttempt = () => {
    const escapeMsg: string = 'You successfully escaped!';
    setCatchMsg(escapeMsg);
    setAttemptCount(0);
    setDisableCatch(true);
    setIsInEncounter(false);
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
      {encounter ? (
        <Box component='div' display='flex' justifyContent='flex-start' flexGrow={1} columnGap={2}>
          <Box component='div' display='flex' flexDirection='column' rowGap={1}>
            <Box component='div'>
              <ButtonGroup
                variant='contained'
                ref={anchorRef}
                aria-label='split button'
                sx={{ width: '100%' }}
                disabled={
                  disableCatch || partyLeader?.hp <= 0 || !playerItems.some((playerItem: IItem) => playerItem.type === 'Ball' && playerItem.qty !== 0)
                }
              >
                <Button onClick={catchAttempt} disabled={selectedBall?.qty <= 0} sx={{ flexGrow: 1 }}>
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
                          {ballOptions.map((option: IItem, index: number) => (
                            <MenuItem
                              key={index}
                              selected={index === selectedIndex}
                              disabled={option.qty <= 0}
                              onClick={(event: MouseEvent<HTMLLIElement>) => changeSelectedBall(event, index)}
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
            <Button variant='contained' disabled={!isInEncounter} onClick={escapeAttempt}>
              Escape
            </Button>
            <Typography mt={1} textAlign='center' sx={{ alignSelf: 'center' }}>
              {selectedBall?.qty > 0 && partyLeader?.hp > 0
                ? ''
                : partyLeader?.hp > 0
                ? `You're out of ${selectedBall?.name}s!`
                : 'Your Pokemon has fainted!'}
            </Typography>
          </Box>
          <Box component='div' className={styles.encounterDetails}>
            <Typography component='span' display='block' textAlign='center' width={250}>
              {catchMsg ? catchMsg : `Encountered a wild ${capitalize(encounter?.name)}!`}
            </Typography>
            <Image
              alt={`${encounter?.name} icon`}
              width={50}
              height={50}
              src={encounter?.sprites.versions['generation-v']['black-white'].animated.front_default}
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
