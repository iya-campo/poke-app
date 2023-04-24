import React, { useState } from 'react';
import styles from '@/styles/components/MyTeam.module.scss';
import { MoreVert, ArrowUpward, ArrowDownward, Computer } from '@mui/icons-material/';
import { Container, Box, Typography, Menu, IconButton, MenuItem, Button, ListItemIcon, ListItemText } from '@mui/material';
import { capitalize } from 'utils/Utils';

function MyTeam(props: any) {
  const [anchorEl, setAnchorEl]: any = React.useState<null | HTMLElement>(null);
  const [selectedPokemon, setSelectedPokemon]: any = useState({});
  const open = Boolean(anchorEl);
  const partyOptions = ['Move Up', 'Move Down', 'Store in PC'];
  const partyOptionsIcons = [<ArrowUpward />, <ArrowDownward />, <Computer />];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e: any) => {
    setAnchorEl(null);
  };

  const handleMenuAction = (e: any, optionIndex: number) => {
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

  const updatePartyLeader = () => {};

  const movePokemon = (position: string) => {
    if ((position === 'up' && selectedPokemon.order === 0) || (position === 'down' && selectedPokemon.order === props.team.length - 1)) return;

    const oldPosition = selectedPokemon.order;
    const newPosition = position === 'up' ? selectedPokemon.order - 1 : selectedPokemon.order + 1;

    let pokemonMovedUp = props.team.find((movedPokemon: any) => movedPokemon.order === oldPosition);
    pokemonMovedUp = { ...pokemonMovedUp, order: newPosition };
    let pokemonMovedDown = props.team.find((movedPokemon: any) => movedPokemon.order === newPosition);
    pokemonMovedDown = { ...pokemonMovedDown, order: oldPosition };

    const updatedTeam = props.team;

    updatedTeam.map((pokemon: any) => {
      if (pokemon.order === newPosition) {
        Object.keys(pokemon).forEach((key) => {
          pokemon[key] = pokemonMovedUp[key];
        });
      }
      if (pokemon.order === oldPosition) {
        Object.keys(pokemon).forEach((key) => {
          pokemon[key] = pokemonMovedDown[key];
        });
      }
    });

    props.setTeam([...updatedTeam]);
    props.setPartyLeader((prevState: any) => props.team[prevState.order]);
  };

  const depositPokemon = () => {
    if (props.team.length > 1) {
      // store first pokemon found into pc storage
      const storedPokemon = props.team.find((pokemon: any) => pokemon.id === selectedPokemon?.id);
      props.setPCStorage((prevState: any) => [storedPokemon, ...prevState]);

      // remove stored pokemon and reorder party
      const updatedTeam = props.team.toSpliced(selectedPokemon?.order, 1);
      updatedTeam.map((pokemon: any, index: number) => {
        pokemon.order = index;
      });
      props.setTeam([...updatedTeam]);

      if (props.partyLeader.order === 0) {
        // if the stored pokemon is first in order
        // set updated team's first pokemon as party leader
        props.setPartyLeader(updatedTeam[0]);
        return;
      }
      if (props.partyLeader.order === storedPokemon.order) {
        // if the stored pokemon isn't first in order
        // set pokemon before the stored one as party leader
        props.setPartyLeader(props.team[storedPokemon.order - 1]);
        return;
      }
    } else {
      // alert: cannot store your last pokemon
    }
  };

  const withdrawPokemon = (pokemon: any) => {
    let withdrawnPokemon: any = {};

    props.setTeam((prevState: any) => {
      // withdraw pokemon and match object keys
      withdrawnPokemon = [
        ...prevState,
        {
          id: pokemon.id,
          order: props.team.length,
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
      // remove withdrawn pokemon from PC storage
      props.setPCStorage(props.pcStorage.toSpliced(props.pcStorage.indexOf(pokemon), 1));
      console.log(withdrawnPokemon);
      return withdrawnPokemon;
    });
  };

  return (
    <Container sx={{ my: 4 }}>
      <Typography component='h2'>My Team</Typography>
      <Box component='div' display='flex' flexWrap='wrap' my={2}>
        <Box component='div' className={styles.partyList} width={props.team.length > 3 ? '400px' : 'auto'}>
          {props.team?.map((pokemon: any, teamIndex: number) => (
            <Box
              key={teamIndex}
              className={styles.partyPokemon}
              sx={{ backgroundColor: props.partyLeader?.order === pokemon.order ? '#bbb' : '#ddd' }}
            >
              <Typography component='span'>{pokemon.name}</Typography>
              <IconButton
                aria-label='more'
                id='long-button'
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup='true'
                onClick={(e: any) => {
                  handleClick(e);
                  setSelectedPokemon(pokemon);
                }}
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
                {partyOptions.map((option: any, optionIndex: number) => (
                  <MenuItem
                    key={optionIndex}
                    value={optionIndex}
                    onClick={(e: any) => {
                      handleMenuAction(e, optionIndex);
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
        <Box component='div' className={styles.pcStorage}>
          <Typography component='h4' pb={2}>
            PC Storage
          </Typography>
          {props.pcStorage && props.pcStorage.length > 0 ? (
            <Box component='div' display='flex' sx={{ maxHeight: '300px', flexWrap: 'wrap', overflowY: 'auto' }}>
              {props.pcStorage.map((pokemon: any, index: number) => (
                <Button key={index} variant='outlined' className={styles.storagePokemon} onClick={() => withdrawPokemon(pokemon)}>
                  {capitalize(pokemon?.name)}
                </Button>
              ))}
            </Box>
          ) : (
            <Typography component='span' display='inline-block' pt={2}>
              Explore the wilderness to catch Pokemon!
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default MyTeam;
