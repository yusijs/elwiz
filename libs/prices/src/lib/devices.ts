import { DeviceConfig } from '@elwiz/pulse';
import { ElwizConfig } from '@elwiz/common';

export const getDevices = (config: ElwizConfig): Array<DeviceConfig> => {
  return [
    {
      haBaseTopic: config.haBaseTopic,
      name: 'Price',
      uniqueId: 'elwiz_price',
      devClass: 'monetary',
      staClass: 'total',
      unitOfMeasurement: config.priceCurrency,
      stateTopic: 'price'
    },
    {
      haBaseTopic: config.haBaseTopic,
      name: 'Average price',
      uniqueId: 'elwiz_price_average',
      devClass: 'monetary',
      staClass: 'total',
      unitOfMeasurement: config.priceCurrency,
      stateTopic: 'priceAvg'
    },
    {
      haBaseTopic: config.haBaseTopic,
      name: 'Average price month',
      uniqueId: 'elwiz_price_average_month',
      devClass: 'monetary',
      staClass: 'total',
      unitOfMeasurement: config.priceCurrency,
      stateTopic: 'priceAvgMonth'
    }
  ];
};
