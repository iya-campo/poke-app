import React, { useState, useEffect } from 'react';
import { ArrowDropDown } from '@mui/icons-material';
import { Box, Button, ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, Typography } from '@mui/material';
import { capitalize, randomNumberGenerator, replaceAll } from 'utils/Utils';

function EncounterFrame(props: any) {
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const [disableCatch, setDisableCatch] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [catchMsg, setCatchMsg] = useState('');

  const ballOptions = props.playerItems.filter((playerItem: any) => playerItem.type === 'Ball');

  useEffect(() => {
    // reset message and attempt count for every new encounter
    setCatchMsg('');
    setAttemptCount(0);
    setDisableCatch(false);
  }, [props.encounter]);

  useEffect(() => {
    // find party leader in the team
    // and set the newly deducted hp
    props.setTeam(() => {
      const partyLeader = props.team.find((pokemon: any) => pokemon.id === props.partyLeader.id);
      if (partyLeader) partyLeader.hp = props.partyLeader.hp;
      return props.team;
    });
  }, [props.partyLeader]);

  const damagePokemon = () => {
    // improve to vary damage according to opponent
    // prevent health from dipping lower than zero
    const sustainedDamage: number = 10;
    props.setPartyLeader((prevState: any) => ({ ...prevState, hp: prevState.hp - sustainedDamage >= 0 ? prevState.hp - sustainedDamage : 0 }));
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
      props.setPCStorage((prevState: any) => [props.encounter, ...prevState]);
      setCatchMsg(successMsg);
      setAttemptCount(0);
      setDisableCatch(true);
    } else {
      setAttemptCount((prevState) => {
        const failMsg = replaceAll('Oh no! POKEMON broke free. Catch attempts: COUNT', {
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
          <Box component='div' mb={2}>{`Encountered a wild ${capitalize(props.encounter?.name)}!`}</Box>
          <Box component='div' display='flex' alignContent={'center'}>
            <>
              <ButtonGroup variant='contained' ref={anchorRef} aria-label='split button'>
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
                              key={option}
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
            </>
            <Typography sx={{ ml: 2, alignSelf: 'center' }}>
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
          No wild Pokemon in sight.
        </Box>
      )}
    </Box>
  );
}

export default EncounterFrame;
