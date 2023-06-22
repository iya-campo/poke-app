import React, { useState, useEffect, Dispatch, SetStateAction, useContext, MouseEvent, SyntheticEvent } from 'react';
import PokeAppContext from '@/contexts/PokeAppContext';
import { ICartItem, IItem, IPlayer, IPokemon, IPokemonStats } from '@/types/PokeApp';
import ShopItem from './ShopItem';
import { Container, Box, Typography, Button, Tabs, Tab } from '@mui/material';
import styles from '@/styles/components/PokeMart.module.scss';
import { checkPokemonStats, checkValuablePrice } from '@/utils/Utils';
import { HIGH_TIER, LOW_TIER } from '@/utils/Constants';
import pokeMart from '@/data/PokeMart';

interface IPokeMartContext {
  playerInfo: IPlayer;
  setPlayerInfo: Dispatch<SetStateAction<IPlayer>>;
  playerItems: IItem[];
  setPlayerItems: Dispatch<SetStateAction<IItem[]>>;
  pcStorage: IPokemon[];
  setPCStorage: Dispatch<SetStateAction<IPokemon[]>>;
  isMobile: boolean;
}

function PokeMart() {
  const { playerInfo, setPlayerInfo, playerItems, setPlayerItems, pcStorage, setPCStorage, isMobile }: IPokeMartContext = useContext(PokeAppContext);

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [valuables, setValuables] = useState<IItem[]>([]);
  const [shopItems, setShopItems] = useState<ICartItem[]>([]);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    setShopItems(pokeMart);
    setValuables(playerItems.filter((playerItem: IItem) => playerItem.type === 'Valuable'));
  }, [playerItems]);

  const addToCart = (item: ICartItem) => {
    if (item.inCart >= 99) return;
    if (!cartItems || !cartItems.includes(item)) {
      setCartItems((prevState: ICartItem[]) => {
        item.inCart += 1;
        const addedItem = [...prevState, item];
        return addedItem;
      });
    } else {
      item.inCart += 1;
    }
    setTotalAmount((prevState: number) => prevState + item.price);
  };

  const removeFromCart = (item: ICartItem) => {
    if (item.inCart <= 0) return;
    if (!cartItems && item.inCart > 1) {
      setCartItems((prevState: ICartItem[]) => {
        item.inCart -= 1;
        const removedItem = cartItems.filter((cartItem: ICartItem) => cartItem.id !== item.id);
        return removedItem;
      });
    } else {
      item.inCart -= 1;
    }
    setTotalAmount((prevState: number) => prevState - item.price);
  };

  const checkout = () => {
    if (totalAmount > playerInfo.pokeDollars) return;
    const itemOwned = cartItems.filter((cartItem: ICartItem) => playerItems.some((playerItem: IItem) => playerItem.id === cartItem.id));
    Promise.all(
      cartItems.map((cartItem: ICartItem) => {
        if (!itemOwned.includes(cartItem)) {
          // if cart item isn't owned by player yet
          setPlayerItems((prevState: IItem[]) => [
            ...prevState,
            { id: cartItem.id, name: cartItem.name, type: cartItem.type, qty: cartItem.inCart, icon: cartItem.icon },
          ]);
        } else {
          // if owned by player, go through player items
          // look for cart item bought and inc quantity
          playerItems.map((playerItem: IItem) => {
            if (playerItem.name.indexOf(cartItem.name) == 0) {
              playerItem.qty += cartItem.inCart;
            }
          });
        }
      })
    ).then(() => {
      setPlayerInfo((prevState: IPlayer) => ({ ...prevState, pokeDollars: prevState.pokeDollars - totalAmount }));
      shopItems?.forEach((shopItem: ICartItem) => (shopItem.inCart = 0));
      setCartItems([]);
      setTotalAmount(0);
    });
  };

  const sell = (itemType: string, sellable: IItem | IPokemon) => {
    let sellPrice: number = 0;

    switch (itemType) {
      case 'pokemon':
        sellPrice = checkPokemonPrice((sellable as IPokemon).stats);
        setPCStorage(pcStorage.filter((_, index: number) => index !== pcStorage.indexOf(sellable as IPokemon)));
        break;
      case 'valuable':
        sellPrice = checkValuablePrice(sellable.name) * (sellable as IItem).qty;
        setPlayerItems(playerItems.filter((valuableToSell: IItem) => valuableToSell.id !== sellable.id));
        break;
      default:
      //
    }
    setPlayerInfo((prevState: IPlayer) => ({ ...prevState, pokeDollars: prevState.pokeDollars + sellPrice }));
  };

  const checkPokemonPrice = (pokemonStats: IPokemonStats[]) => {
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
        <Typography component='span' display='inline-block' pl={0.5}>{`$ ${playerInfo.pokeDollars}`}</Typography>
      </Box>

      <Box component='div' sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', my: 2 }}>
        <Tabs
          orientation='vertical'
          variant='scrollable'
          value={selectedTab}
          onChange={(event: SyntheticEvent<Element, Event>, tab: number) => {
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
          <Box component='div'>
            {shopItems
              ? shopItems.map((item: ICartItem, index: number) => (
                  <ShopItem key={index} item={item} addToCart={addToCart} removeFromCart={removeFromCart} />
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
          {(pcStorage && pcStorage.length > 0) || (valuables && valuables.length > 0) ? (
            <Box component='div' display='flex' sx={{ maxHeight: '240px', flexWrap: 'wrap', overflowY: 'auto' }}>
              {pcStorage.map((pokemon: IPokemon, index: number) => (
                <Button key={index} variant='outlined' sx={{ mr: 1, mb: 1 }} onClick={() => sell('pokemon', pokemon)} className={styles.sellItem}>
                  {pokemon?.name} - {`$ ${checkPokemonPrice(pokemon.stats)}`}
                </Button>
              ))}
              {valuables.map((valuable: IItem, index: number) => (
                <Button key={index} variant='outlined' sx={{ mr: 1, mb: 1 }} onClick={() => sell('valuable', valuable)} className={styles.sellItem}>
                  {`${valuable?.name} ×${valuable?.qty}`} - {`$ ${checkValuablePrice(valuable.name) * valuable?.qty}`}
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
