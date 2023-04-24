import React from 'react';
import styles from '@/styles/components/CustomModal.module.scss';
import { Modal, Box } from '@mui/material';

function CustomModal(props: any) {
  const handleClose = () => props.setOpen(false);

  return (
    <Modal open={props.open} onClose={handleClose} aria-labelledby='modal-title' aria-describedby='modal-description'>
      <Box component='div' className={styles.modalContainer} display='flex'>
        <Box component='div' className={styles.modalContent}>
          {props.component}
        </Box>
      </Box>
    </Modal>
  );
}

export default CustomModal;
