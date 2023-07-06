import React from 'react';
import { Result } from 'antd';
import { Link } from 'react-router-dom';

export default function Error404() {
  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={<Link to='/'>Back Home</Link>}
      // icon={<img src={image} alt='404' />}
    />
  );
}
