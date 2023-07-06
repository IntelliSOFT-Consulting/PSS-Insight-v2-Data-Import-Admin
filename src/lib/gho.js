import axios from 'axios';
import delay from './delay';

const gho = axios.create({
  baseURL: 'http://172.104.91.116:7009/api/v1/redirect/',
  headers: { 'Content-Type': 'application/json' },
});
export const getIndicators = async (indicators, countryCode) => {
  const indicatorCodes = await Promise.all(
    indicators.map(async (indicator, i) => {
      await delay(i, 1000);
      const value = await gho.get(
        `${indicator}?$filter=SpatialDim eq '${countryCode}'&$select=Value,TimeDimType,TimeDim,SpatialDimType,SpatialDim`
      );
      return { ...value?.data, indicator };
    })
  );
  return indicatorCodes;
};
