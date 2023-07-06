import React from 'react';
import Modal from './Modal';
import { createUseStyles } from 'react-jss';
import {
  PaperClipIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';

const useStyles = createUseStyles({
  infoModal: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  infoLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem',
    marginTop: '1rem',
    backgroundColor: '#CCE0F1',
    width: 'max-content',
    '& svg': {
      marginRight: '0.5rem',
      width: '1rem',
      height: '1rem',
    },
  },
  guide: {
    marginTop: '1rem',
    fontSize: '0.8rem',
    backgroundColor: 'rgb(239 246 255)',
    borderRadius: '0.375rem',
    padding: '0.5rem',
    '& p': {
      color: '#3B82F6',
      textEmphasis: 'italic !important',
      marginTop: '0px !important',
    },
    '& > div': {
      display: 'flex',
      '& > div:first-child': {
        flexShrink: 0,
      },
      '& > div:last-child': {
        marginLeft: '0.75rem',
        flex: '1 1 0%',
        display: 'block !important',
      },
    },
  },
  infoIcon: {
    width: '1.5rem',
    height: '1.5rem',
    color: '#3B82F6',
  },
});

export default function InfoModal(props) {
  const classes = useStyles();
  const referenceSheetLink = props.referenceSheet
    ? `http://172.104.91.116:7009/api/v1/master-template/view-file/${props.referenceSheet}`
    : `${window.location.origin}/#/indicators/indicator/${props.open?.categoryId}`;
  return (
    <Modal {...props} type='info'>
      <div classname={classes.infoModal}>
        <div>{props.open?.indicatorName}</div>
        <div class={classes.guide}>
          <div>
            <div>
              <InformationCircleIcon className={classes.infoIcon} />
            </div>
            <div>
              <p>
                To find a specific indicator in the reference sheet, use the
                search function (typically Ctrl+F or Command+F) and enter the
                name or keyword of the indicator you're looking for.
              </p>
            </div>
          </div>
        </div>
        <a
          href={referenceSheetLink}
          className={classes.infoLink}
          target='_blank'
          rel='noreferrer'
        >
          <PaperClipIcon />
          Reference Sheet
        </a>
      </div>
    </Modal>
  );
}
