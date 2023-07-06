import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  modal: {
    '& .ant-modal-content': {
      '& .ant-modal-close-icon': {
        color: ({ type }) => {
          switch (type) {
            case 'info':
              return '#0067b9 !important';
            case 'warning':
              return '#f39c12 !important';
            case 'error':
              return '#FD0C0B !important';
            case 'success':
              return '#218838 !important';
            default:
              return '#0067b9 !important';
          }
        },
      },
      '& .ant-modal-header': {
        backgroundColor: ({ type }) => {
          switch (type) {
            case 'info':
              return '#0067b9 !important';
            case 'warning':
              return '#f39c12 !important';
            case 'error':
              return '#FD0C0B !important';
            case 'success':
              return '#218838 !important';
            default:
              return '#0067b9 !important';
          }
        },

        '& .ant-modal-title': {
          color: 'white',
        },
      },
    },
  },
});

export default function ModalItem({ children, type, ...props }) {
  const classes = useStyles({ type });

  return (
    <Modal className={classes.modal} {...props}>
      {children}
    </Modal>
  );
}
