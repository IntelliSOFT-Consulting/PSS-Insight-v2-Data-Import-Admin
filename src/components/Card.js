import React from 'react';
import { Card } from '@dhis2/ui';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0067B9',
    color: 'white',
    margin: 0,
    padding: '0px 1.5rem',
    marginBottom: '20px',
    fontSize: '14px',
    width: '100%',
  },
  cardTitle: {
    margin: 0,
    padding: '10px 1.5rem',
    marginBottom: '20px',
    fontSize: '14px',
    width: '100%',
    backgroundColor: '#0067B9',
    color: 'white',
  },
  cardBody: {
    padding: '10px 1.5rem',
    width: 'calc(100% - 3rem)',
    overflow: 'auto',
    margin: '0 auto',
  },
  footer: {
    padding: '15px 1.5rem',
    backgroundColor: '#E3EEF7',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    display: 'flex',
  },
});

export default function CardItem({ title, footer, children }) {
  const classnames = useStyles();
  return (
    <Card className={classnames.card}>
      {typeof title === 'string' ? (
        <h5 className={classnames.cardTitle}>{title}</h5>
      ) : (
        <div className={classnames.header}>{title}</div>
      )}
      <div className={classnames.cardBody}>{children}</div>
      {footer && <div className={classnames.footer}>{footer}</div>}
    </Card>
  );
}
