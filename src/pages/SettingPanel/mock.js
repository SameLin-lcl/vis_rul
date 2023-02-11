import _ from "lodash";

export const MOCK_UNITS_DATA = Array(100)
  .fill(0)
  .map((d, i) => {
    return {
      name: `s_${i}`,
      x: _.random(0, 100, true),
      y: _.random(0, 100, true)
    };
  });
