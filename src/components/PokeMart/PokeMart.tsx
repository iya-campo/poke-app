import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Tabs, Tab } from '@mui/material';
import pokeMart from 'utils/PokeMart';
import { checkItems } from 'utils/Utils';

function PokeMart(props: any) {
  const [totalAmount, setTotalAmount]: any = useState(0);
  const [shopItems, setShopItems]: any = useState([]);
  const [cartItems, setCartItems]: any = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    setShopItems(pokeMart);
  }, []);

  const addToCart = (item: any) => {
    if (item.inCart >= 99) return;
    if (!cartItems || !cartItems.includes(item)) {
      setCartItems((prevState: any) => {
        item.inCart += 1;
        const addedItem = [...prevState, item];
        return addedItem;
      });
    } else {
      item.inCart += 1;
    }
    setTotalAmount((prevState: any) => prevState + item.price);
  };

  const removeFromCart = (item: any) => {
    if (item.inCart <= 0) return;
    if (!cartItems && item.inCart > 1) {
      setCartItems((prevState: any) => {
        item.inCart -= 1;
        const removedItem = cartItems.filter((cartItem: any) => cartItem.id !== item.id);
        return removedItem;
      });
    } else {
      item.inCart -= 1;
    }
    setTotalAmount((prevState: any) => prevState - item.price);
  };

  const checkout = (cartItems: any, totalAmount: number) => {
    if (totalAmount > props.playerInfo.pokeDollars) return;
    const itemOwned = cartItems.filter((cartItem: any) => props.playerItems.some((playerItem: any) => playerItem.id === cartItem.id));
    cartItems.map((cartItem: any) => {
      if (!itemOwned.includes(cartItem)) {
        // if cart item isn't owned by player yet
        props.setPlayerItems((prevState: any) => [
          ...prevState,
          { id: cartItem.id, name: cartItem.name, type: cartItem.type, quantity: cartItem.inCart, icon: cartItem.icon },
        ]);
      } else {
        // if owned by player, go through player items
        // look for cart item bought and inc quantity
        props.playerItems.map((playerItem: any) => {
          if (playerItem.name.indexOf(cartItem.name) == 0) {
            playerItem.quantity += cartItem.inCart;
          }
        });
      }
    });

    props.setPlayerInfo((prevState: any) => ({ ...prevState, pokeDollars: prevState.pokeDollars - totalAmount }));
    shopItems.forEach((shopItem: any) => (shopItem.inCart = 0));
    setCartItems([]);
    setTotalAmount(0);
  };

  const sellPokemon = (e: any) => {
    const sellPrice: number = 200;
    props.setPCStorage(props.pcStorage.filter((pokemon: any) => pokemon.id === e.target.value));
    props.setPlayerInfo((prevState: any) => ({ ...prevState, pokeDollars: prevState.pokeDollars + sellPrice }));
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div role='tabpanel' hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other}>
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography component='span'>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  return (
    <Container sx={{ my: 4 }}>
      <Typography component='h2'>Poke Mart</Typography>
      <Typography component='span' display='inline-block' pt={2}>
        {`Poke Dollars: $ ${props.playerInfo.pokeDollars}`}
      </Typography>

      <Box component='div' sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', my: 2 }}>
        <Tabs
          orientation='vertical'
          variant='scrollable'
          value={selectedTab}
          onChange={(e: any, tab: number) => {
            setSelectedTab(tab);
          }}
          aria-label='Vertical tabs example'
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab label='Buy' {...a11yProps(0)} />
          <Tab label='Sell' {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          <Typography component='h4' sx={{ mb: 2 }}>
            Purchase Supplies
          </Typography>
          {shopItems
            ? shopItems.map((item: any, index: number) => (
                <Box key={index} component='div' display='flex' alignItems='center' flexWrap='wrap' py={1}>
                  <Typography component='span' display='block' pr={6} width={200}>
                    {item.name}
                  </Typography>
                  <Box component='div' pr={6}>
                    <Button variant='outlined' size='small' disabled={item.inCart <= 0} onClick={() => removeFromCart(item)}>
                      -
                    </Button>
                    <Typography component='span' display='inline-block' px={2}>
                      {item.inCart}
                    </Typography>
                    <Button variant='outlined' size='small' disabled={item.inCart >= 99} onClick={() => addToCart(item)}>
                      +
                    </Button>
                  </Box>
                  <Box component='div' display='flex'>
                    <Typography component='span' pr={1}>
                      Owned:
                    </Typography>
                    <Typography component='span'>{checkItems(props.playerItems, item.name, 'quantity')}</Typography>
                  </Box>
                </Box>
              ))
            : 'Shop is empty.'}
          <Box component='div' display='flex' alignItems='center' mt={2}>
            <Button variant='contained' sx={{ mr: 2 }} onClick={() => checkout(cartItems, totalAmount)}>
              Checkout
            </Button>
            <Typography>{`Total: $ ${totalAmount}`}</Typography>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <Typography component='h4' pb={2}>
            Sell Pokemon
          </Typography>
          {props.pcStorage && props.pcStorage.length > 0 ? (
            <>
              {props.pcStorage.map((pokemon: any, index: number) => (
                <Button key={index} onClick={sellPokemon} value={pokemon.id}>
                  {pokemon.name}
                </Button>
              ))}
            </>
          ) : (
            <Typography component='span' display='inline-block' pt={2}>
              PC Storage is empty.
            </Typography>
          )}
        </TabPanel>
      </Box>
    </Container>
  );
}

export default PokeMart;
