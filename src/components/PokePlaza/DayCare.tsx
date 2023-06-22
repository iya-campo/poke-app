import React, { useState, useEffect, useContext, Dispatch, SetStateAction } from 'react';
import PokeAppContext from '@/contexts/PokeAppContext';
import { IAlerts, IItem, IPokemon } from '@/types/PokeApp';
import { Box, Divider, Typography, FormControl, InputLabel, Select, MenuItem, Button, SelectChangeEvent } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import Image from 'next/image';
import styles from '@/styles/components/DayCare.module.scss';
import { findPokeblockPref } from '@/utils/Utils';

interface IDayCareContext {
  setOpenAlerts: Dispatch<SetStateAction<IAlerts>>;
  playerItems: IItem[];
  setPlayerItems: Dispatch<SetStateAction<IItem[]>>;
  team: IPokemon[];
  isMobile: boolean;
}

function DayCare() {
  const { setOpenAlerts, playerItems, setPlayerItems, team, isMobile }: IDayCareContext = useContext(PokeAppContext);

  const [pokeblocks, setPokeblocks] = useState<IItem[]>([]);
  const [activePokemon, setActivePokemon] = useState<IPokemon>(team[0]);

  useEffect(() => {
    setPokeblocks(playerItems.filter((playerItem: IItem) => playerItem.type === 'Pokeblock'));
  }, [playerItems, activePokemon]);

  const changeActivePokemon = (event: SelectChangeEvent<number>) => {
    const newActivePokemon: IPokemon = team[event.target.value as number];
    setActivePokemon(newActivePokemon);
  };

  const feedPokeblock = (pokeblock: IItem) => {
    if (activePokemon.affection >= 50) return;
    // raise affection more if pokeblock is preferred
    if (findPokeblockPref(activePokemon.types).includes(pokeblock.name)) {
      activePokemon.affection += 2;
      setOpenAlerts({
        isOpen: true,
        msg: `${activePokemon.name} loved the ${pokeblock.name}!`,
      });
    } else {
      activePokemon.affection += 1;
      setOpenAlerts({
        isOpen: true,
        msg: `${activePokemon.name} ate the ${pokeblock.name}!`,
      });
    }
    // remove pokeblock from items if only one is left
    if (pokeblock.qty === 1) {
      setPlayerItems(playerItems.filter((playerItem: IItem) => pokeblock.id !== playerItem.id));
    } else {
      pokeblock.qty -= 1;
      setPokeblocks((prevState: IItem[]) => [...prevState]);
    }
  };

  const petPokemon = () => {
    setOpenAlerts({
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
      <Box component='div' display='flex' justifyContent={!isMobile ? 'space-between' : 'center'} flexWrap='wrap' gap={2}>
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
              <Image alt={`${activePokemon?.name} icon`} width={80} height={80} src={activePokemon.img} />
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
              {team?.map((partyPokemon: IPokemon, index: number) => {
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
              pokeblocks.map((pokeblock: IItem, index: number) => (
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
                  {`\n×${pokeblock.qty}`}
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
