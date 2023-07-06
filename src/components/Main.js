import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, MenuItem } from '@dhis2/ui';
import classes from '../App.module.css';

export default function Main({ title, sideLinks, showDashboard, children }) {
  const location = useLocation();

  const activePath = location.pathname;

  const matchPaths = (path, activePath) =>
    path?.replace('/', '') === activePath?.replace('/', '');

  return (
    <main
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - 48px)',
        height: '100%',
      }}
    >
      <aside className={classes.sidebar}>
        <Menu>
          {showDashboard && (
            <Link to='/'>
              <MenuItem label='Dashboard' />
            </Link>
          )}

          <p
            style={{
              background: '#005A8E46',
              margin: 0,
              padding: 16,
              marginBottom: 0,
              fontSize: 14,
              width: 270,
            }}
          >
            {title}
          </p>
          {sideLinks?.map(item => (
            <Link to={item.path} key={item.path}>
              <MenuItem
                label={item.label}
                active={matchPaths(item.path, activePath)}
              />
            </Link>
          ))}
        </Menu>
      </aside>
      <section
        style={{
          backgroundColor: '#F4F6F8',
          flexGrow: 1,
          padding: 20,
        }}
      >
        {children}
      </section>
    </main>
  );
}
