import React, { useState, useEffect } from 'react';
import styles from '@/styles/components/PokeMart.module.scss';
import { Container, Box, Typography, Button, Tabs, Tab } from '@mui/material';
import pokeMart from '@/data/PokeMart';
import { checkPokemonStats, checkValuablePrice } from '@/utils/Utils';
import ShopItem from './ShopItem';

function PokeMart(props: any) {
  const [totalAmount, setTotalAmount]: any = useState(0);
  const [valuables, setValuables]: any = useState([]);
  const [shopItems, setShopItems]: any = useState([]);
  const [cartItems, setCartItems]: any = useState([]);
  const [selectedTab, setSelectedTab]: any = useState(0);

  // pokemon stat avg tiers
  const HIGH_TIER = 75;
  const LOW_TIER = 40;

  useEffect(() => {
    setShopItems(pokeMart);
    setValuables(props.playerItems.filter((playerItem: any) => playerItem.type === 'Valuable'));
  }, [props.playerItems]);

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

  const checkout = () => {
    if (totalAmount > props.playerInfo.pokeDollars) return;
    const itemOwned = cartItems.filter((cartItem: any) => props.playerItems.some((playerItem: any) => playerItem.id === cartItem.id));
    Promise.all(
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
      })
    ).then(() => {
      props.setPlayerInfo((prevState: any) => ({ ...prevState, pokeDollars: prevState.pokeDollars - totalAmount }));
      shopItems.forEach((shopItem: any) => (shopItem.inCart = 0));
      setCartItems([]);
      setTotalAmount(0);
    });
  };

  const sell = (itemType: string, sellable: any) => {
    let sellPrice: number = 0;

    switch (itemType) {
      case 'pokemon':
        sellPrice = checkPokemonPrice(sellable.stats);
        props.setPCStorage(props.pcStorage.toSpliced(props.pcStorage.indexOf(sellable), 1));
        break;
      case 'valuable':
        sellPrice = checkValuablePrice(sellable.name) * sellable?.quantity;
        props.setPlayerItems(props.playerItems.filter((valuableToSell: any) => valuableToSell.id !== sellable.id));
        break;
      default:
      //
    }
    props.setPlayerInfo((prevState: any) => ({ ...prevState, pokeDollars: prevState.pokeDollars + sellPrice }));
  };

  const checkPokemonPrice = (pokemonStats: any) => {
    if (checkPokemonStats(pokemonStats) >= HIGH_TIER) {
      return 300;
    }
    if (checkPokemonStats(pokemonStats) > LOW_TIER && checkPokemonStats(pokemonStats) < HIGH_TIER) {
      return 200;
    }
    if (checkPokemonStats(pokemonStats) <= LOW_TIER) {
      return 100;
    }
    return 0;
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <Box
        role='tabpanel'
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
        sx={{ flexGrow: 1 }}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography component='span'>{children}</Typography>
          </Box>
        )}
      </Box>
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
      <Typography component='h2' variant='h2'>
        Poke Mart
      </Typography>
      <Box component='div'>
        <Typography component='h4' variant='h4' display='inline-block' pt={2}>
          Poke Dollars:
        </Typography>
        <Typography component='span' display='inline-block' pl={0.5}>{`$ ${props.playerInfo.pokeDollars}`}</Typography>
      </Box>

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
          <Typography component='h4' variant='h4' sx={{ mb: 2 }}>
            Purchase Supplies
          </Typography>
          <Box component='div' className={styles.shopContainer}>
            {shopItems
              ? shopItems.map((item: any, index: number) => (
                  <ShopItem key={index} playerItems={props.playerItems} item={item} addToCart={addToCart} removeFromCart={removeFromCart} />
                ))
              : 'Shop is empty.'}
          </Box>
          <Box component='div' display='flex' alignItems='center' mt={2}>
            <Button variant='contained' sx={{ mr: 2 }} onClick={checkout}>
              Checkout
            </Button>
            <Box component='div'>
              <Typography component='h4' variant='h4' display='inline-block'>
                Total:
              </Typography>
              <Typography component='span' display='inline-block' pl={0.5}>{`$ ${totalAmount}`}</Typography>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <Typography component='h4' variant='h4' pb={2}>
            Sell for Poke Dollars
          </Typography>
          {(props.pcStorage && props.pcStorage.length > 0) || (valuables && valuables.length > 0) ? (
            <Box component='div' display='flex' sx={{ maxHeight: '240px', flexWrap: 'wrap', overflowY: 'auto' }}>
              {props.pcStorage.map((pokemon: any, index: number) => (
                <Button key={index} variant='outlined' sx={{ mr: 1, mb: 1 }} onClick={() => sell('pokemon', pokemon)} className={styles.sellItem}>
                  {pokemon?.name} - {`$ ${checkPokemonPrice(pokemon.stats)}`}
                </Button>
              ))}
              {valuables.map((valuable: any, index: number) => (
                <Button key={index} variant='outlined' sx={{ mr: 1, mb: 1 }} onClick={() => sell('valuable', valuable)} className={styles.sellItem}>
                  {`${valuable?.name} ×${valuable?.quantity}`} - {`$ ${checkValuablePrice(valuable.name) * valuable?.quantity}`}
                </Button>
              ))}
            </Box>
          ) : (
            <Typography component='span' display='inline-block' pt={2}>
              Nothing to sell.
            </Typography>
          )}
        </TabPanel>
      </Box>
    </Container>
  );
}

export default PokeMart;
