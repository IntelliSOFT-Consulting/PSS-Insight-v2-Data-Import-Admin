import React from 'react';
import { DataQuery } from '@dhis2/app-runtime';
import i18n from '@dhis2/d2-i18n';
import { createUseStyles } from 'react-jss';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layouts/Layout';
import './App.module.css';
import './custom.css';
import 'sheet-happens/dist/index.css';


const useStyles = createUseStyles({
  '@global': {
    'svg.checked.disabled': {
      fill: '#ABABAB !important',
      '& .background': {
        fill: '#ABABAB !important',
      },
    },
  },
});

const query = {
  me: {
    resource: 'me.json',
    params: {
      fields:
        'id,username,displayName,userCredentials[userRoles[id]],organisationUnits[id]',
    },
  },
  indicators: {
    resource: 'indicators.json',
    params: ({ page }) => ({
      order:
        'name:asc, shortName:asc, code:asc, formName:asc, valueType:asc, id:asc',
      fields:
        'id,name,shortName,code,formName,valueType,aggregationType,domainType',
      pageSize: 5000,
      page,
    }),
  },
  dataElements: {
    resource: 'dataElements',
    params: ({ page }) => ({
      order: 'code:asc, formName:asc, valueType:asc, id:asc',
      fields: 'id,code,formName,valueType,displayName',
      pageSize: 10000,
    }),
  },
  programs: {
    resource: 'programs.json',
    params: ({ page }) => ({
      order: 'code:asc, formName:asc, valueType:asc, id:asc',
      fields: 'id,code,formName,valueType,displayName,programStages[id]',
      pageSize: 5000,
    }),
  },
  orgUnits: {
    resource: 'organisationUnits',
    params: ({ page }) => ({
      fields: 'id,name,code',
      order: 'name:asc',
      filter: 'level:eq:3',
      pageSize: 10000,
    }),
  },
};

const MyApp = () => {
  const classes = useStyles();
  return (
    <HashRouter>
      <div className={classes.root}>
        <DataQuery query={query}>
          {({ error, loading, data }) => {
            if (error) return <span>ERROR</span>;
            if (loading) return <span>...</span>;
            return (
              <Routes>
                <Route path='/*' element={<Layout data={data} />} />
              </Routes>
            );
          }}
        </DataQuery>
      </div>
    </HashRouter>
  );
};

export default MyApp;
