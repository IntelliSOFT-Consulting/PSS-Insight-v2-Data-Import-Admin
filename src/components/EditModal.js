import React from 'react';
import { TextArea } from '@dhis2/ui';
import Modal from './Modal';

export default function EditModal({ children, ...props }) {
  const value = props.open?.indicatorName || props.open?.name;
  
  return (
    <Modal {...props}>
      <TextArea
        value={value}
        name={props.open?.categoryId || props.open?.id}
        onChange={props.onChange}
        rows={props.rows || 5}
      />
    </Modal>
  );
}
