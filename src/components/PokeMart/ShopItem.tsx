import React from 'react';
import { Box, Button, Typography } from '@mui/material';

import { checkItems } from '@/utils/Utils';

function ShopItem(props: any) {
  return (
    <Box key={props.item.id} component='div' display='flex' alignItems='center' flexWrap='wrap' py={1}>
      <Typography component='span' display='block' width={200}>
        {props.item.name}
      </Typography>
      <Box component='div' pr={!props.isMobile ? 6 : 2}>
        <Button variant='outlined' size='small' disabled={props.item.inCart <= 0} onClick={() => props.removeFromCart(props.item)}>
          -
        </Button>
        <Typography
          component='span'
          display='inline-block'
          width={!props.isMobile ? '70px' : 'fit-content'}
          textAlign='center'
          px={!props.isMobile ? 2 : 1.5}
        >
          {props.item.inCart}
        </Typography>
        <Button variant='outlined' size='small' disabled={props.item.inCart >= 99} onClick={() => props.addToCart(props.item)}>
          +
        </Button>
      </Box>
      <Box component='div' display='flex'>
        <Typography component='span' width='70px' pr={1}>
          Owned:
        </Typography>
        <Typography component='span'>{checkItems(props.playerItems, props.item.name, 'quantity')}</Typography>
      </Box>
    </Box>
    // <Box key={props.item.id} component='div' display='flex' alignItems='center' flexWrap='wrap' py={1}>
    //   <Button variant='outlined' onClick={() => props.addToCart(props.item)}>
    //     TEST
    //   </Button>
    // </Box>
  );
}

export default ShopItem;
