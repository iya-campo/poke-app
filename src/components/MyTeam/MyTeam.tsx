import React, { useEffect } from 'react';
import styles from '@/styles/components/MyTeam.module.scss';
import { MoreVert } from '@mui/icons-material/';
import { Container, Box, Typography, Menu, IconButton, MenuItem } from '@mui/material';
import { capitalize } from 'utils/Utils';

function MyTeam(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const partyOptions = ['Move Up', 'Move Down', 'Store in PC'];

  useEffect(() => {
    renderPCStorage();
  }, [props.pcStorage]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e: any) => {
    setAnchorEl(null);
  };

  const handleMenuAction = (e: any, optionIndex: number, selectedPokemon: any) => {
    switch (optionIndex) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        if (props.team.length > 1) {
          const storedPokemon = props.team.find((pokemon: any) => pokemon.id === selectedPokemon.id);
          props.setPCStorage((prevState: any) => [storedPokemon, ...prevState]);
          const updatedTeam = props.team.filter((pokemon: any) => pokemon.id !== selectedPokemon.id);
          props.setTeam(updatedTeam);
        } else {
          // alert: cannot store your last pokemon
        }
        break;
      default:
      //
    }
    setAnchorEl(null);
  };

  const renderPCStorage = () => {};

  return (
    <Container sx={{ my: 4 }}>
      <Typography component='h2'>My Team</Typography>
      <Box component='div' display='flex' my={2}>
        <Box component='div' mr={4}>
          {props.team?.map((pokemon: any, teamIndex: number) => (
            <Box key={teamIndex} className={styles.partyPokemon} about={pokemon}>
              {pokemon.name}
              <IconButton
                aria-label='more'
                id='long-button'
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup='true'
                onClick={handleClick}
              >
                <MoreVert />
              </IconButton>
              <Menu
                id='long-menu'
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: 48 * 4.5,
                    width: '20ch',
                  },
                }}
              >
                {partyOptions.map((option: any, optionIndex: number) => (
                  <MenuItem
                    key={option}
                    selected={option === 'Pyxis'}
                    value={optionIndex}
                    onClick={(e: any) => {
                      handleMenuAction(e, optionIndex, pokemon);
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ))}
        </Box>
        <Box component='div' className={styles.pcStorage}>
          <Typography component='h4' pb={1}>
            PC Storage
          </Typography>
          {props.pcStorage && props.pcStorage.length > 0 ? (
            <Box component='div' display='flex' sx={{ maxHeight: '300px', flexWrap: 'wrap', overflowY: 'auto' }}>
              {props.pcStorage.map((pokemon: any, index: number) => (
                <Box key={index} className={styles.storagePokemon}>
                  {capitalize(pokemon.name)}
                </Box>
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
