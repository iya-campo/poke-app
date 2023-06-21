import React, { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import styles from '@/styles/components/CustomModal.module.scss';
import { Modal, Box } from '@mui/material';

interface ICustomModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  component: ReactNode;
}

function CustomModal({ open, setOpen, component }: ICustomModalProps) {
  const handleClose = () => setOpen(false);

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby='modal-title' aria-describedby='modal-description'>
      <Box component='div' className={styles.modalContainer} display='flex'>
        <Box component='div' className={styles.modalContent}>
          {component}
        </Box>
      </Box>
    </Modal>
  );
}

export default CustomModal;
