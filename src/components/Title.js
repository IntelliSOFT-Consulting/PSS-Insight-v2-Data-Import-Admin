import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  title: {
    fontSize: '16px',
    fontWeight: 500,
    marginBottom: '1rem',
    marginTop: '2rem',
    padding: '10px',
    backgroundColor: ({ type }) =>
      type === 'primary' ? '#E3EEF7 !important' : '#F6F6F6',
  },
});

export default function Title({ text, type = 'primary' }) {
  const classes = useStyles({ type });
  return <h1 className={classes.title}>{text}</h1>;
}
