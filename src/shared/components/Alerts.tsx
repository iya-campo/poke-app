import React from 'react';
import { Alert, Collapse, Container, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

function Alerts(props: any) {
  return (
    <Container sx={{ position: 'fixed', top: 10, left: 0, right: 0, zIndex: 9999 }}>
      <Collapse
        in={props.openAlert.isOpen}
        timeout='auto'
        addEndListener={() => {
          const timeId = setTimeout(() => {
            // After 3 seconds close the alert
            props.setOpenAlerts((prevState: any) => ({ ...prevState, isOpen: false }));
          }, 3000);
          return () => {
            clearTimeout(timeId);
          };
        }}
        unmountOnExit
      >
        <Alert
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                props.setOpenAlerts((prevState: any) => ({ ...prevState, isOpen: false }));
              }}
            >
              <Close fontSize='inherit' />
            </IconButton>
          }
          sx={{ my: 2, py: 1 }}
        >
          {props.openAlert.msg}
        </Alert>
      </Collapse>
    </Container>
  );
}

export default Alerts;
