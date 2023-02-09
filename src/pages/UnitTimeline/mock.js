import _ from "lodash";

const MOCK_TIMELINE_LEN = 120;
const MOCK_MODEL_NUM = 4;
export const MOCK_FEATURE_NUM = 4;
export const MOCK_MODEL_VALUE_MAX = 100;
export const MOCK_MODELS = ["RF", "SVR", "XGB", "LSTM"];

export const MOCK_TIMELINE_DATA = {
  overall: Array(MOCK_TIMELINE_LEN)
    .fill(0)
    .map((d, i) => _.random(0, 1, true)),
  models: Array(MOCK_MODEL_NUM)
    .fill(0)
    .map((d, i) => {
      return Array(MOCK_TIMELINE_LEN)
        .fill(0)
        .map((d, i) => {
          return {
            value: _.random(-MOCK_MODEL_VALUE_MAX, MOCK_MODEL_VALUE_MAX, true),
            importance: Array(MOCK_FEATURE_NUM)
              .fill(0)
              .map((d, i) => _.random(0, 1, true))
          };
        });
    })
};
