import { sum } from './sum';

export type DemoType = typeof sum;

const demoModule = {
  sum,
};

export default demoModule;
