import React, { useContext } from 'react';
import { Box, Button, Typography } from '@mui/material';

import { checkItems } from '@/utils/Utils';
import PokeAppContext from '@/contexts/PokeAppContext';
import { ICartItem, IItem } from '@/types/PokeApp';

interface IShopItemProps {
  key: number;
  item: ICartItem;
  addToCart: (item: ICartItem) => void;
  removeFromCart: (item: ICartItem) => void;
}

function ShopItem({ item, addToCart, removeFromCart }: IShopItemProps) {
  const { playerItems, isMobile }: { playerItems: IItem[]; isMobile: boolean } = useContext(PokeAppContext);

  return (
    <Box key={item.id} component='div' display='flex' alignItems='center' flexWrap='wrap' py={1} rowGap={1}>
      <Typography component='span' display='block' width={200}>
        {item.name}
      </Typography>
      <Box component='div' pr={!isMobile ? 6 : 2}>
        <Button variant='outlined' disabled={item.inCart <= 0} sx={{ minWidth: 5 }} onClick={() => removeFromCart(item)}>
          -
        </Button>
        <Typography component='span' display='inline-block' width={!isMobile ? '70px' : 'fit-content'} textAlign='center' px={!isMobile ? 2 : 1.5}>
          {item.inCart}
        </Typography>
        <Button variant='outlined' disabled={item.inCart >= 99} sx={{ minWidth: 5 }} onClick={() => addToCart(item)}>
          +
        </Button>
      </Box>
      <Box component='div' display='flex'>
        <Typography component='span' width={!isMobile ? '70px' : 'fit-content'} pr={1}>
          In Bag:
        </Typography>
        <Typography component='span'>{checkItems(playerItems, item.name, 'quantity')}</Typography>
      </Box>
    </Box>
  );
}

export default ShopItem;
