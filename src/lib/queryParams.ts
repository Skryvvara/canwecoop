import { QueryParamConfig, withDefault, BooleanParam, DelimitedArrayParam } from 'next-query-params';

export const CustomArrayParam = withDefault(
  DelimitedArrayParam,
  []
) as QueryParamConfig<string[]>;

export const CustomBooleanParam = withDefault(
  BooleanParam,
  undefined
) as QueryParamConfig<boolean | undefined>;
