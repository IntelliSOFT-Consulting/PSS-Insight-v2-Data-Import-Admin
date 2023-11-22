const groupData = (indicators, dataElements) => {
  const groupedData = {};
  for (const indicator of indicators) {
    groupedData[indicator?.code] = dataElements?.filter(
      element =>
        element.code?.startsWith(indicator.code) &&
        !element.code?.includes('Comments') &&
        !element.code?.includes('Uploads')
    );
  }

  return groupedData;
};

export const formatDataElements = (
  indicators,
  dataElements,
  events,
  benchmarks
) => {
  const header1 = [''];
  const header2 = ['Reporting Year'];
  const header3 = [''];

  const data = [];
  const groupedData = groupData(indicators, dataElements);

  const headers = Object.values(groupedData);
  for (const header of headers) {
    for (const element of header) {
      header1.push({ label: element.displayName, colspan: 3 });
      header2.push({ label: element.code, colspan: 3 });
      header3.push('value', 'National Target', 'International Benchmark');
    }
  }

  //   populate data with events
  const headersText = headers.flat().map(header => header.id);
  const flatHeaders = headers.flat();
  for (const event of events) {
    const dataValues = {};
    for (const dataValue of event.dataValues) {
      const index = headersText.indexOf(dataValue.dataElement);

      const dataItem = flatHeaders[index];

      if (index > -1) {
        dataValues[dataItem?.code] =
          dataValue.value === 'true'
            ? 'Yes'
            : dataValue.value === 'false'
            ? 'No'
            : dataValue.value;

        dataValues[`${dataItem?.code} National Target`] = null;
        dataValues[`${dataItem?.code} International Benchmark`] =
          benchmarks?.find(benchmark => benchmark.name?.includes(dataItem?.code))
            ?.value || 0;
      }
    }

    data.push({
      reportingYear: event.occurredAt.substring(0, 4),
      ...dataValues,
    });
  }

  return { headers: [header1, header2, header3], data: data };
};

export const formatColumns = (indicators, dataElements) => {
  const groupedData = groupData(indicators, dataElements);

  const headers = Object.values(groupedData).flat();

  const columns = headers.map(header => {
    return {
      title: header.displayName,
      key: header.code,
      width: 300,
      children: [
        {
          title: header.code,
          key: header.code,
          children: [
            {
              title: 'Value',
              dataIndex: header.code,
              key: 'value',
            },
            {
              title: 'National Target',
              dataIndex: `${header.code} National Target`,
              key: `${header.code} National Target`,
            },
            {
              title: 'International Benchmark',
              dataIndex: `${header.code} International Benchmark`,
              key: `${header.code} International Benchmark`,
            },
          ],
        },
      ],
    };
  });
  columns.unshift({
    title: 'Reporting Year',
    dataIndex: 'reportingYear',
    key: 'reportingYear',
    width: 250,
  });

  return columns;
};

export const createExport = (indicators, dataElements, events) => {
  try {
    const header1 = [
      {
        header: '',
        key: 'Reporting Year',
        width: 20,
        wrapText: true,
      },
    ];
    const header2 = ['Reporting Year'];
    const header3 = [''];

    const data = [];
    const groupedData = groupData(indicators, dataElements);

    const headers = Object.values(groupedData).flat();

    for (const element of headers) {
      header1.push([
        {
          header: element.displayName,
          key: element.code,
          width: 20,
          wrapText: true,
        },
        {
          header: '',
          key: element.code,
          width: 20,
          wrapText: true,
        },
        {
          header: '',
          key: element.code,
          width: 20,
          wrapText: true,
        },
      ]);
      header2.push([element.code, '', '']);
      header3.push('value', 'National Target', 'International Benchmark');
    }

    const flatHeaders = headers.flat();
    const headersText = flatHeaders.map(header => header.id);
    for (const event of events) {
      const dataValues = [];
      for (const dataValue of event.dataValues) {
        const index = headersText.indexOf(dataValue.dataElement);

        // const dataItem = flatHeaders[index];

        if (index > -1) {
          dataValues[index] = [
            dataValue.value === 'true'
              ? 'Yes'
              : dataValue.value === 'false'
              ? 'No'
              : dataValue.value,
            null,
            null,
          ];
          // fill in the rest of the array with nulls
          for (let i = 0; i < headersText.length; i++) {
            if (!dataValues[i]) {
              dataValues[i] = [null, null, null];
            }
          }
        }
      }

      data.push([event.occurredAt.substring(0, 4), ...dataValues.flat()]);
    }

    return [header1.flat(), header2.flat(), header3, ...data];
  } catch (error) {
    console.log('error: ', error);
  }
};
