import {useDataEngine} from '@dhis2/app-runtime';
import {useEffect, useState} from 'react';

export default function useBenchmarks() {
    const [benchmarkDataSet, setBenchmarkDataSet] = useState(null);
    const [dataValues, setDataValues] = useState([]);
    const [orgUnit, setOrgUnit] = useState(null);

    const engine = useDataEngine();

    const getDataSet = async () => {
        if(!orgUnit) return;
        const dataSet = await getBenchmarkDataSet();
        const dataValues = await getDataValues({
            params: {
                period: new Date().getFullYear() - 1,
                dataSet: dataSet.id,
                orgUnit: orgUnit
            }
        });
        setBenchmarkDataSet(dataSet);

        setDataValues(dataValues);
    };

    useEffect(() => {
        getDataSet();
        getOrgUnit();
    }, []);

    const getOrgUnit = async () => {
        const {data} = await engine.query({
            data: {
                resource: 'organisationUnits',
                params: {
                    fields: ['id', 'code', 'name'],
                    filter: 'level:eq:1',
                    pageSize: 1
                }
            }
        })

        setOrgUnit(data?.organisationUnits[0]?.id);
    };

    const getDataElements = async () => {
        const {data} = await engine.query({
            data: {
                resource: 'dataElements',
                params: {
                    fields: ['id', 'code', 'name'],
                    filter: 'name:ilike:benchmark',
                    pageSize: 1000
                }
            }
        })
        return data ? data.dataElements : null;
    };

    const getBenchmarkDataSet = async () => {
        const {data} = await engine.query({
            data: {
                resource: 'dataSets',
                params: {
                    fields: ['id', 'displayName', 'dataSetElements[dataElement[id,displayName]]'],
                    filter: 'name:ilike:benchmark',
                }
            }
        })
        return data ? data.dataSets[0] : null;
    }
    const getDataValues = async ({params}) => {
        const {data} = await engine.query({
            data: {
                resource: 'dataValueSets',
                params: {
                    ...params,
                    fields: ['dataValues[dataElement,value,period,orgUnit]']
                }
            }
        })

        const dataElements = await getDataElements();


        const values = data?.dataValues.reduce((acc, cur) => {
            const index = acc.findIndex(dv => dv.dataElement === cur.dataElement);
            if (index === -1) {
                acc.push(cur);
            }
            return acc;
        }, []);

        return dataElements?.map(de => {
            const value = values.find(v => v.dataElement === de.id);
            return {
                ...de,
                ...value || {},
                value: value?.value || 0
            }
        })
    }

    const saveDataValues = async (dataValues) => {
        const response = await engine.mutate({
            resource: 'dataValues',
            type: 'create',
            data: {
                ...dataValues,
                ds: benchmarkDataSet.id,
                ou: orgUnit,
                pe: new Date().getFullYear() - 1
            }
        })
        if (response) getDataSet();
    }

    const updateDataValues = async ({dataValues}) => {
        await engine.mutate({
            resource: 'dataValues',
            type: 'update',
            data: {
                dataValues
            }
        })
    }

    const deleteDataValues = async ({dataValues}) => {
        await engine.mutate({
            resource: 'dataValues',
            type: 'delete',
            data: {
                dataValues
            }
        })
    }

    return {
        benchmarkDataSet,
        dataValues,
        setDataValues,
        saveDataValues,
        updateDataValues,
        deleteDataValues
    }
};
