import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import classes from '../App.module.css';

const Accordion = ({ title, children }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={classes.accordion}>
      <div
        className={classes.accordionTitle}
        onClick={() => setIsActive(!isActive)}
      >
        <div>{title}</div>
        <div className={classes.accordionIcon}>
          {isActive ? (
            <ChevronDownIcon color='black' />
          ) : (
            <ChevronRightIcon color='black' />
          )}
        </div>
      </div>
      {isActive && <div className={classes.accordionContent}>{children}</div>}
    </div>
  );
};

export default Accordion;
