import { Center, CircularLoader } from '@dhis2/ui';
import { Skeleton } from 'antd';
import React from 'react';

export default function Loader({ type }) {
  return (
    <>
      {type === 'skeleton' ? (
        <>
          <Skeleton.Button active shape='default' block />
          <br />
          <br />
          <Skeleton.Button active shape='default' block />
          <br />
          <br />
          <Skeleton.Button active shape='default' block />
        </>
      ) : (
        <Center>
          <CircularLoader />
        </Center>
      )}
    </>
  );
}
