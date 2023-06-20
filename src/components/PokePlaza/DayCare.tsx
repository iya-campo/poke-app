import React, { useState, useEffect } from 'react';
import styles from '@/styles/components/DayCare.module.scss';
import { Box, Divider, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { findPokeblockPref } from '@/utils/Utils';
import Image from 'next/image';

function DayCare(props: any) {
  const [pokeblocks, setPokeblocks]: any = useState([]);
  const [activePokemon, setActivePokemon]: any = useState(props.team[0]);

  useEffect(() => {
    setPokeblocks(props.playerItems.filter((playerItem: any) => playerItem.type === 'Pokeblock'));
  }, [props.playerItems, activePokemon]);

  const changeActivePokemon = (e: any) => {
    const newActivePokemon = props.team[e.target.value];
    setActivePokemon(newActivePokemon);
  };

  const feedPokeblock = (pokeblock: any) => {
    if (activePokemon.affection >= 50) return;
    // raise affection more if pokeblock is preferred
    if (findPokeblockPref(activePokemon.types).includes(pokeblock.name)) {
      activePokemon.affection += 2;
      props.setOpenAlerts({
        isOpen: true,
        msg: `${activePokemon.name} loved the ${pokeblock.name}!`,
      });
    } else {
      activePokemon.affection += 1;
      props.setOpenAlerts({
        isOpen: true,
        msg: `${activePokemon.name} ate the ${pokeblock.name}!`,
      });
    }
    // remove pokeblock from items if only one is left
    if (pokeblock.quantity === 1) {
      props.setPlayerItems(props.playerItems.filter((playerItem: any) => pokeblock.id !== playerItem.id));
    } else {
      pokeblock.quantity -= 1;
      setPokeblocks((prevState: any) => [...prevState]);
    }
  };

  const petPokemon = () => {
    props.setOpenAlerts({
      isOpen: true,
      msg: `${activePokemon.name} looks happy!`,
    });
  };

  return (
    <Box component='div' className={styles.dayCareModal}>
      <Box display='flex' justifyContent='space-between' pb={1}>
        <Typography component='h2' variant='h2' p={0}>
          Day Care
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box component='div' display='flex' justifyContent={!props.isMobile ? 'space-between' : 'center'} flexWrap='wrap' gap={2}>
        <Box component='div' display='flex' flexDirection='column' justifyContent='center' className={styles.pokePanel}>
          <Box component='div' display='flex' alignItems='center' mb={2}>
            <Box display='flex' flexDirection='column'>
              {[...Array(5 - Math.trunc(activePokemon?.affection / 10)).keys()].map((index: number) => (
                <Favorite key={index} />
              ))}
              {[...Array(Math.trunc(activePokemon?.affection / 10)).keys()].map((index: number) => (
                <Favorite key={index} color='primary' />
              ))}
            </Box>
            <Box component='div' className={styles.pokemonImg}>
              <Image alt={`${props.selectedPokemon?.name} icon`} width={80} height={80} src={activePokemon.img} />
            </Box>
          </Box>
          <Button variant='contained' onClick={petPokemon}>{`Pet ${activePokemon.name}`}</Button>
        </Box>
        <Box component='div' display='flex' flexDirection='column' className={styles.pokeblockPanel}>
          <FormControl sx={{ mb: 2 }} fullWidth>
            <InputLabel id='simple-select-label'>Active Pokemon</InputLabel>
            <Select
              labelId='simple-select-label'
              id='simple-select'
              label='Active Pokemon'
              value={activePokemon ? activePokemon?.order : 0}
              onChange={changeActivePokemon}
            >
              {props.team?.map((partyPokemon: any, index: number) => {
                return (
                  <MenuItem key={index} value={index}>
                    {partyPokemon.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Typography component='h4' variant='h4' textAlign='center' pt={1} pb={1}>
            Feed Pokeblocks
          </Typography>
          <Box display='flex' justifyContent='center' flexWrap='wrap'>
            {pokeblocks.length > 0 ? (
              pokeblocks.map((pokeblock: any, index: number) => (
                <Button
                  key={index}
                  variant='outlined'
                  component='div'
                  className={styles.pokeblock}
                  sx={{ mx: 0.5 }}
                  onClick={() => {
                    feedPokeblock(pokeblock);
                  }}
                >
                  {pokeblock.name.split(' ')[0]}
                  {`\n×${pokeblock.quantity}`}
                </Button>
              ))
            ) : (
              <Typography component='span' textAlign='center' fontSize={12} color='GrayText' pt={2} width='100%'>
                Buy pokeblocks from the Poke Mart.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default DayCare;
