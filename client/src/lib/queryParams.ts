import {
  DelimitedArrayParam,
  QueryParamConfig,
  withDefault,
} from "use-query-params";

export const CommaArrayParam = withDefault(
  DelimitedArrayParam,
  []
) as QueryParamConfig<string[]>;
