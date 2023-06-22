import React, { Dispatch, SetStateAction, useContext } from 'react';
import { Alert, Collapse, Container, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import PokeAppContext from '@/contexts/PokeAppContext';
import { IAlerts } from '@/types/PokeApp';

interface IAlertsProps {
  openAlert: IAlerts;
}

function Alerts({ openAlert }: IAlertsProps) {
  const { setOpenAlerts }: { setOpenAlerts: Dispatch<SetStateAction<IAlerts>> } = useContext(PokeAppContext);

  return (
    <Container sx={{ position: 'fixed', top: 10, left: 0, right: 0, zIndex: 9999 }}>
      <Collapse
        in={openAlert.isOpen}
        timeout='auto'
        addEndListener={() => {
          const timeId: NodeJS.Timeout = setTimeout<[]>(() => {
            // After 5 seconds close the alert
            setOpenAlerts((prevState: IAlerts) => ({ ...prevState, isOpen: false }));
          }, 5000);
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
                setOpenAlerts((prevState: IAlerts) => ({ ...prevState, isOpen: false }));
              }}
            >
              <Close fontSize='inherit' />
            </IconButton>
          }
          sx={{ my: 2, py: 1 }}
        >
          {openAlert.msg}
        </Alert>
      </Collapse>
    </Container>
  );
}

export default Alerts;
