import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import importRoutes from '../routes/importRoutes';
import { createUseStyles } from 'react-jss';
import Error404 from '../Pages/Error404';

const { Content, Sider } = Layout;

const useStyles = createUseStyles({
  '@global': {
    '.ant-layout': {
      backgroundColor: '#f0f2f5',
      '& .ant-layout-sider': {
        backgroundColor: '#fff',
        position: 'fixed',
      },
    },
  },
  layout: {
    display: 'grid !important',
    gridTemplateColumns: '270px 1fr',
    gridTemplateRows: '1fr',
    gridTemplateAreas: '"sidebar main"',
    minHeight: 'calc(100vh - 48px)',
    '& .ant-menu-item-selected': {
      backgroundColor: '#B9D2E0 !important',
      borderRadius: '0px !important',
      color: '#0266B9 !important',
    },
    '& .ant-menu-submenu-selected >.ant-menu-submenu-title': {
      color: '#0266B9 !important',
    },
    '& li': {
      '& :hover': {
        borderRadius: '0px !important',
      },
    },
  },
});

const createLink = (label, path) => <Link to={path}>{label}</Link>;

export default function MainLayout({ data }) {
  const classes = useStyles();

  const sideLinks = [
    {
      label: 'Data Import/Export',
      key: 'Data Import/Export',
    },
    {
      label: 'Data Import',
      key: 'Data Import',
      children: [
        {
          label: createLink('Data Import Template', '/'),
          key: 'template',
        },
        {
          label: createLink('Upload Data', '/upload'),
          key: 'uploadData',
        },
      ],
    },
    {
      label: createLink('Data Export', '/export'),
      key: 'Data Export',
    },
    {
      label: createLink('Global Health Observatory Import', '/gho'),
      key: 'GHO',
    },
  ];

  return (
    <div className={classes.layout}>
      <Layout>
        <Sider
          width={270}
          style={{
            minHeight: 'calc(100vh - 48px)',
          }}
        >
          <Menu
            mode='inline'
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{
              height: '100%',
              borderRight: 0,
            }}
            items={sideLinks}
          />
        </Sider>
      </Layout>
      <Layout
        style={{
          padding: '0 24px 24px',
        }}
      >
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            maxWidth: 'calc(100vw - 308px)',
          }}
        >
          <Routes>
            {importRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={<route.element data={data} />}
              />
            ))}
            <Route path='*' element={<Error404 />} />
          </Routes>
        </Content>
      </Layout>
    </div>
  );
}
