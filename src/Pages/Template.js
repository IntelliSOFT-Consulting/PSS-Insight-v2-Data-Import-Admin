import React, { useState } from 'react';
import Card from '../components/Card';
import instructions from '../data/instructions.json';
import { createUseStyles } from 'react-jss';
import generateTemplate from '../lib/genarateTemplate';
import { Button } from 'antd';

const useStyles = createUseStyles({
  title: {
    fontSize: '16px',
  },

  instructions: {
    margin: '2rem 0px',
    fontSize: '15px',
    '& > div': {
      margin: '2rem 0px',
      '& h4': {
        margin: '10px 0px',
      },
      '& p': {
        margin: '0px',
        fontWeight: '300',
      },
    },
  },
  download: {
    '& .ant-btn': {
      backgroundColor: '#002F6C !important',
      color: 'white !important',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      margin: '1rem 0px',
      '&:hover': {
        backgroundColor: '#005DA5 !important',
        color: 'white !important',
      },
    },
  },
});

export default function Template({ data }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  return (
    <Card title='DOWNLOAD DATA IMPORT TEMPLATE'>
      <div className={classes.title}>Instructions:</div>
      <div className={classes.instructions}>
        {instructions.map((instruction, index) => (
          <div key={index}>
            <h4>{instruction.title}:</h4>
            <p>{instruction.description}</p>
          </div>
        ))}
      </div>
      {data?.indicators && (
        <div className={classes.download}>
          <p>National Master Template Version</p>
          <Button
            className={classes.button}
            onClick={() => {
              setLoading(true);
              const template = generateTemplate(
                data.indicators.indicators,
                data.dataElements.dataElements?.filter(
                  item =>
                    !item.displayName?.includes('Comment') &&
                    !item.displayName?.includes('_Upload') &&
                    !item.code?.includes('Benchmark')
                ),
                data.orgUnits.organisationUnits
              );
              const element = document.createElement('a');

              template.workbook.xlsx.writeBuffer().then(data => {
                const blob = new Blob([data], {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const url = window.URL.createObjectURL(blob);
                element.setAttribute('href', url);

                element.setAttribute('download', 'data-import-template.xlsx');

                document.body.appendChild(element);
                element.click();

                setTimeout(() => {
                  document.body.removeChild(element);
                }, 1000);
                setLoading(false);
              });
            }}
            loading={loading}
          >
            Download Template
          </Button>
        </div>
      )}
    </Card>
  );
}
