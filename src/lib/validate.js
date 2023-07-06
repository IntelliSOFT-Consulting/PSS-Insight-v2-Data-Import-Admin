export const validateDate = date => {
  if (!date) return null;
  const dateRegex =
    /^\d{4}[-\/.](0?[1-9]|1[012])[-\/.](0?[1-9]|[12][0-9]|3[01])$/;
  const yearRegex = /^\d{4}$/;
  if (dateRegex.test(date) || yearRegex.test(date)) {
    return date.split(/[-\/.]/)[0];
  } else {
    return null;
  }
};

export const dataToJson = (data, dataElements, orgUnits) => {
  const descriptions = data[0].flat();
  const columns = data[1].flat();
  const rows = data.slice(2);
  const json = rows.map((row, i) => {
    const obj = {};
    row.forEach((item, index) => {
      if (columns[index] === 'Reporting Year') {
        obj.reportingYear = {
          row: i + 3,
          response: validateDate(item?.toString()),
          column: 'Reporting Year',
        };
      } else if (columns[index] === 'Organisation Unit') {
        obj.organisationUnit = {
          row: i + 3,
          response: orgUnits?.find(orgUnit => orgUnit.name === item?.toString())
            ?.id,
          column: 'Organisation Unit',
        };
      } else
        obj[columns[index]] = {
          row: i + 3,
          column: descriptions[index],
          response: item == 'Yes' ? true : item == 'No' ? false : item,
          indicator: dataElements?.find(
            element => element.code === columns[index]
          )?.code,
        };
    });
    return obj;
  });
  return json;
};

const findDuplicatedYears = years => {
  const yearCounts = {};
  const duplicatedYears = [];

  const validYears = years.filter(year => year?.response);

  for (const { row, response } of validYears) {
    if (yearCounts[response]) {
      duplicatedYears.push({ row, response });
    } else {
      yearCounts[response] = true;
    }
  }

  return validYears.filter(year =>
    duplicatedYears.map(item => item.response).includes(year.response)
  );
};

export const getYearErrors = jsonData => {
  const yearErrors = [];
  const years = jsonData.map(row => row.reportingYear);

  const duplicateYears = findDuplicatedYears(years);

  if (duplicateYears.length > 0) {
    duplicateYears.forEach(year => {
      yearErrors.push([
        `Row No. ${year.row}`,
        `Reporting Year`,
        'Year should be unique.',
      ]);
    });
  }

  const emptyYears = years.filter(year => !year?.response);
  if (emptyYears.length > 0) {
    emptyYears.forEach(year => {
      yearErrors.push([
        `Row No. ${year?.row}`,
        `Reporting Year`,
        'Year mus not be empty and must be in the format YYYY.',
      ]);
    });
  }
  return yearErrors;
};

export const getTypeErrors = (jsonData, dataElements) => {
  const typeErrors = [];

  for (const row of jsonData) {
    for (const [key, value] of Object.entries(row)) {
      if (key !== 'reportingYear') {
        const dataElement = dataElements.find(element => element.code === key);
        if (dataElement) {
          if (dataElement.valueType === 'NUMBER') {
            if (value.response && isNaN(value.response)) {
              typeErrors.push([
                `Row No. ${value.row}`,
                value.column,
                `Value must be a number.`,
              ]);
            }
          } else if (dataElement.valueType === 'BOOLEAN') {
            if (value.response && ![true, false].includes(value.response)) {
              typeErrors.push([
                `Row No. ${value.row}`,
                value.column,
                `Value must be either 'yes' or 'no'.`,
              ]);
            }
          } else if (dataElement.valueType === 'DATE') {
            if (value.response && !validateDate(value.response)) {
              typeErrors.push([
                `Row No. ${value.row}`,
                value.column,
                `Value must be a valid date in the format YYYY-MM-DD.`,
              ]);
            }
          }
        }
      }
    }
  }

  return typeErrors;
};

export const getErrors = (jsonData, dataElements) => {
  const errors = [];
  const yearErrors = getYearErrors(jsonData);
  const typeErrors = getTypeErrors(jsonData, dataElements);
  return [...errors, ...yearErrors, ...typeErrors];
};
