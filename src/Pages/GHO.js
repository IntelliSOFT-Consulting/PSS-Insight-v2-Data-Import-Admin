import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Transfer, SingleSelectField, SingleSelectOption } from '@dhis2/ui';
import { createUseStyles } from 'react-jss';
import { Button, Form, Table, Popconfirm } from 'antd';
import { useDataMutation } from '@dhis2/app-runtime';
import localIndicators from '../data/indicators.json';
import { getIndicators } from '../lib/gho';
import Notification from '../components/Notification';

const useStyles = createUseStyles({
  '@global': {
    '.dhis2-uicore-transfer': {
      '& div.jsx-3958825765': {
        width: 'calc(50% - 16%) !important',
      },
    },
  },
  transfer: {
    '& button.icon-only': {
      background: '#012f6c !important',
      color: '#fff !important',
      '& span, svg': {
        color: '#fff !important',
        fill: '#fff !important',
      },
    },
    '& div.highlighted': {
      background: '#bb0c2f !important',
    },
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
  select: {
    marginBottom: 10,
    width: '30rem',
  },
  table: {
    '& .ant-table-thead': {
      '& tr': {
        '& th': {
          backgroundColor: '#012f6c !important',
          color: 'white',
        },
      },
    },
  },
});

export default function GHO({ data: { orgUnits } }) {
  const [selected, setSelected] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [selecttedCountry, setSelectedCountry] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importedData, setImportedData] = useState([]);

  const classes = useStyles();
  const [form] = Form.useForm();

  const mutation = {
    resource: 'dataValueSets',
    type: 'create',
    data: _data => {
      return { dataValues: Object.values(_data) };
    },
  };

  const [mutate, { loading: mutationLoading, error: mutationError }] =
    useDataMutation(mutation, {
      onComplete: ({ data }) => {
        setSuccess('Data imported successfully');
        setSelected([]);
        setCountry(null);
        form.resetFields();
      },
    });

  const onChange = ({ selected }) => {
    setSelected(selected);
  };

  const handleChange = value => {
    setCountry(value);
  };

  const getIndicatorId = value => {
    const indicator = localIndicators.find(({ value: v }) => v === value);
    return indicator?.id;
  };
  console.log('Country: ', country);
  const handleImport = async values => {
    try {
      setLoading(true);
      const indicators = await getIndicators(
        values.indicators?.selected,
        values.country?.selected
      );

      const orgUnit = orgUnits?.organisationUnits?.find(
        ({ code }) => code === values.country.selected || 'UGA'
      )?.id;

      const formattedData = indicators.map((indicator, i) => {
        const { value } = indicator;
        return value.map(v => {
          return {
            period: v.TimeDim,
            orgUnit,
            dataElement: getIndicatorId(values.indicators?.selected[i]),
            value: v.Value,
          };
        });
      });

      const payload = formattedData.flat();
      setSelectedCountry(
        orgUnits?.organisationUnits?.find(
          ({ code }) => code === values.country.selected
        )?.name
      );
      setImportedData(payload);
      await mutate(payload);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error?.message);
    }
  };

  useEffect(() => {
    if (mutationError) {
      setError(mutationError?.message);

      const timeout = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [mutationError]);

  useEffect(() => {
    if (orgUnits?.organisationUnits) {
      setCountries(orgUnits?.organisationUnits);
    }
  }, [orgUnits]);

  const columns = [
    {
      title: 'Indicator',
      dataIndex: 'dataElement',
      key: 'dataElement',
      render: dataElement => {
        return (
          localIndicators.find(({ id }) => id === dataElement)?.label || ''
        );
      },
    },
    {
      title: 'Country',
      dataIndex: 'orgUnit',
      key: 'orgUnit',
      render: _orgUnit => {
        return selecttedCountry;
      },
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  return (
    <Card
      title='GLOBAL HEALTH OBSERVATORY'
      footer={
        <div className={classes.footer}>
          <Popconfirm
            title='This action will overwrite existing data. Do you want to continue?'
            onConfirm={() => {
              form.submit();
            }}
            okText='Yes'
            cancelText='No'
          >
            <Button type='primary' loading={mutationLoading || loading}>
              Import
            </Button>
          </Popconfirm>
        </div>
      }
    >
      {
        <>
          {error && (
            <Notification
              title='Error'
              message={error}
              status='error'
              onClose={() => setError(null)}
            />
          )}
          {success && (
            <Notification
              title='Success'
              message={success}
              status='success'
              onClose={() => setSuccess(null)}
            />
          )}
          <Form form={form} layout='vertical' onFinish={handleImport}>
            <Form.Item
              label='Country'
              name='country'
              rules={[
                {
                  required: true,
                  message: 'Please select a country',
                },
              ]}
            >
              <SingleSelectField
                className={classes.select}
                filterable
                noMatchText='No match found'
                onChange={({ selected }) => {
                  setCountry(selected);
                }}
                placeholder='Select a country'
                selected={country}
              >
                {orgUnits?.organisationUnits?.map(({ code, name }) => (
                  <SingleSelectOption key={code} label={name} value={code} />
                ))}
              </SingleSelectField>
            </Form.Item>

            <div className={`${classes.root} ${classes.transfer}`}>
              <div>
                <p>
                  Select the data you want to download by clicking on the
                  corresponding indicators.
                </p>
                <Form.Item
                  label='Indicators'
                  name='indicators'
                  rules={[
                    {
                      required: true,
                      message: 'Please select at least one indicator',
                    },
                    {
                      validator: (_, value) =>
                        value?.selected?.length > 0
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error('Please select at least one indicator')
                            ),
                    },
                  ]}
                >
                  <Transfer
                    selected={selected}
                    onChange={onChange}
                    options={localIndicators}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </>
      }
      {importedData?.length > 0 && (
        <Table
          bordered
          columns={columns}
          dataSource={importedData}
          pagination={importedData?.length > 25 ? { pageSize: 25 } : false}
          size='small'
          style={{ marginBottom: '5rem' }}
          className={classes.table}
        />
      )}
    </Card>
  );
}
