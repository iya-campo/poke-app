import React, { Dispatch, MouseEvent, ReactElement, SetStateAction, useContext, useState } from 'react';
import styles from '@/styles/components/MyTeam.module.scss';
import { MoreVert, ArrowUpward, ArrowDownward, Computer } from '@mui/icons-material/';
import { Container, Box, Typography, Menu, IconButton, MenuItem, Button, ListItemIcon, ListItemText, SvgIconTypeMap } from '@mui/material';
import PCStorage from './PCStorage';
import Image from 'next/image';
import { IPokemon } from '@/types/PokeApp';
import PokeAppContext from '@/contexts/PokeAppContext';

interface IMyTeamContext {
  team: IPokemon[];
  setTeam: Dispatch<SetStateAction<IPokemon[]>>;
  pcStorage: IPokemon[];
  setPCStorage: Dispatch<SetStateAction<IPokemon[]>>;
  partyLeader: IPokemon;
  setPartyLeader: Dispatch<SetStateAction<IPokemon>>;
}

function MyTeam() {
  const { team, setTeam, pcStorage, setPCStorage, partyLeader, setPartyLeader }: IMyTeamContext = useContext(PokeAppContext);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<IPokemon>();

  const partyOptions: string[] = ['Move Up', 'Move Down', 'Store in PC'];
  const partyOptionsIcons: ReactElement[] = [<ArrowUpward />, <ArrowDownward />, <Computer />];

  const open: boolean = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleMenuAction = (optionIndex: number) => {
    switch (optionIndex) {
      case 0:
        movePokemon('up');
        break;
      case 1:
        movePokemon('down');
        break;
      case 2:
        depositPokemon();
        break;
      default:
      //
    }
    setAnchorEl(null);
  };

  const movePokemon = (position: string) => {
    if ((position === 'up' && selectedPokemon.order === 0) || (position === 'down' && selectedPokemon.order === team.length - 1)) return;

    const oldPosition: number = selectedPokemon.order;
    const newPosition: number = position === 'up' ? selectedPokemon.order - 1 : selectedPokemon.order + 1;

    let pokemonMovedUp: any = team.find((movedPokemon: IPokemon) => movedPokemon.order === oldPosition);
    pokemonMovedUp = { ...pokemonMovedUp, order: newPosition };
    let pokemonMovedDown: any = team.find((movedPokemon: IPokemon) => movedPokemon.order === newPosition);
    pokemonMovedDown = { ...pokemonMovedDown, order: oldPosition };

    const updatedTeam: IPokemon[] = team;

    updatedTeam.map((pokemon: any) => {
      if (pokemon.order === newPosition) {
        Object?.keys(pokemon).forEach((key: string) => {
          pokemon[key] = pokemonMovedUp[key];
        });
      }
      if (pokemon.order === oldPosition) {
        Object?.keys(pokemon).forEach((key) => {
          pokemon[key] = pokemonMovedDown[key];
        });
      }
    });

    setTeam([...updatedTeam]);
    setPartyLeader((prevState: IPokemon) => team[prevState.order]);
  };

  const depositPokemon = () => {
    if (team.length > 1) {
      // store first pokemon found into pc storage
      const storedPokemon: IPokemon = team.find((pokemon: IPokemon) => pokemon.id === selectedPokemon?.id);
      setPCStorage((prevState: IPokemon[]) => [storedPokemon, ...prevState]);

      // remove stored pokemon and reorder party
      const updatedTeam: IPokemon[] = team.filter((pokemon: IPokemon) => pokemon.order !== selectedPokemon?.order);
      updatedTeam.map((pokemon: IPokemon, index: number) => {
        pokemon.order = index;
      });
      setTeam([...updatedTeam]);

      if (partyLeader.order === 0) {
        // if the stored pokemon is first in order
        // set updated team's first pokemon as party leader
        setPartyLeader(updatedTeam[0]);
        return;
      }
      if (partyLeader.order === storedPokemon.order) {
        // if the stored pokemon isn't first in order
        // set pokemon before the stored one as party leader
        setPartyLeader(team[storedPokemon.order - 1]);
        return;
      }
    } else {
      // alert: cannot store your last pokemon
    }
  };

  const withdrawPokemon = (pokemon: IPokemon) => {
    if (team.length < 6) {
      let updatedTeam: IPokemon[] = [];

      // withdraw pokemon and match object keys
      setTeam((prevState: IPokemon[]) => {
        updatedTeam = [
          ...prevState,
          {
            id: pokemon.id,
            order: team.length,
            name: pokemon.name,
            types: pokemon.types,
            affection: pokemon.affection,
            hp: pokemon.hp,
            maxHp: pokemon.maxHp,
            level: pokemon.level,
            currentExp: pokemon.currentExp,
            expNeeded: pokemon.expNeeded,
            stats: pokemon.stats,
            img: pokemon.img,
          },
        ];
        return updatedTeam;
      });

      // remove withdrawn pokemon from PC storage
      setPCStorage(pcStorage.filter((_, index: number) => index !== pcStorage.indexOf(pokemon)));
    } else {
      // alert: your party is full
    }
  };

  return (
    <Container sx={{ my: 4 }}>
      <Typography component='h2' variant='h2'>
        My Team
      </Typography>
      <Box component='div' display='flex' flexWrap='wrap' my={2}>
        <Box component='div' className={styles.partyList} width={team.length > 3 ? '390px' : '195px'}>
          {team?.map((pokemon: IPokemon, teamIndex: number) => (
            <Box key={teamIndex} className={styles.partyPokemon} sx={{ backgroundColor: partyLeader?.order === pokemon.order ? '#bbb' : '#ddd' }}>
              <Box component='div' display='flex' justifyContent='flex-start' alignItems='center'>
                <Image alt='party pokemon' width={30} height={30} src={pokemon.img}></Image>
                <Typography component='span' pl={2}>
                  {pokemon.name}
                </Typography>
              </Box>
              <IconButton
                aria-label='more'
                id='long-button'
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup='true'
                onClick={(event: MouseEvent<HTMLElement>) => {
                  handleClick(event);
                  setSelectedPokemon(pokemon);
                }}
                sx={{ px: 0 }}
              >
                <MoreVert />
              </IconButton>
              <Menu
                id='long-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: 48 * 4.5,
                    width: '170px',
                  },
                }}
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
              >
                {partyOptions.map((option: string, optionIndex: number) => (
                  <MenuItem
                    key={optionIndex}
                    value={optionIndex}
                    onClick={() => {
                      handleMenuAction(optionIndex);
                    }}
                  >
                    <ListItemIcon>{partyOptionsIcons[optionIndex]}</ListItemIcon>
                    <ListItemText>{option}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ))}
        </Box>
        <PCStorage withdrawPokemon={withdrawPokemon} />
      </Box>
    </Container>
  );
}

export default MyTeam;
