import React from 'react';
import { Box, Button, Typography } from '@mui/material';

import { checkItems } from 'utils/Utils';

function ShopItem(props: any) {
  return (
    <Box key={props.item.id} component='div' display='flex' alignItems='center' flexWrap='wrap' py={1}>
      <Typography component='span' display='block' pr={6} width={200}>
        {props.item.name}
      </Typography>
      <Box component='div' pr={6}>
        <Button variant='outlined' size='small' disabled={props.item.inCart <= 0} onClick={() => props.removeFromCart(props.item)}>
          -
        </Button>
        <Typography component='span' display='inline-block' width='70px' textAlign='center' px={2}>
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
