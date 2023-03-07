import _ from "lodash";
import {
  MOCK_MODEL_VALUE_MAX,
  MOCK_MODELS
} from "../../pages/UnitTimeline/mock";

export const mockFetchModels = () => {
  return {
    maxMin: {
      perf: [
        {
          label: "score",
          max: 100
        },
        {
          label: "rsme",
          max: 100
        },
        {
          label: "r2",
          max: 100
        }
      ],
      // features: { max: 100, min: 0 },
      deviation: { max: 100, min: 0 },
      variance: { max: 100, min: 0 }
    },
    models: ["RF", "SVR", "LSTM", "CNN", "MLP"].map((item) => ({
      model: item,
      perf: [
        {
          label: "score",
          value: _.random(0, 100)
        },
        {
          label: "rsme",
          value: _.random(0, 100)
        },
        {
          label: "r2",
          value: _.random(0, 100)
        }
      ],
      deviation: Array(5)
        .fill(0)
        .map((d, i) => ({
          label: "0 - 100",
          value: _.random(0, 100, true),
          variance: _.random(0, 100, true)
        }))
    }))
  };
};

export const mockFetchUnitsPca = () => {
  return {
    maxMin: {
      x: { max: 1, min: 0 },
      y: { max: 1, min: 0 },
      rul: { max: 200, min: 100 }
    },
    units: Array(100)
      .fill(0)
      .map((d, i) => ({
        unitId: i,
        x: _.random(0, 1, true),
        y: _.random(0, 1, true),
        rul: _.random(100, 200)
      }))
  };
};

const mockInstance = () => {
  return {
    instanceId: _.random(0, 100000),
    unitId: _.random(0, 10),
    x: _.random(0, 100),
    y: _.random(0, 100),
    rul: _.random(0, 100),
    rulMax: 100,
    modelPerf: ["RF", "LSTM", "MLP"].map((item) => ({
      label: item,
      value: _.random(0, 100)
    }))
  };
};

export const mockFetchInstances = (params) => {
  return {
    maxMin: {
      x: { max: 100, min: 0 },
      y: { max: 100, min: 0 },
      modelPref: { max: 100, min: 0 }
    },
    instances: Array(100)
      .fill(0)
      .map(() => mockInstance())
  };
};

const MOCK_FEATURE_NUM = 14;

export const mockFetchFeatures = (params) => {
  return {
    maxMin: {
      importance: {
        max: 100,
        min: 0
      }
    },
    features: Array(MOCK_FEATURE_NUM)
      .fill(0)
      .map((d, i) => ({
        name: `s${i + 4}`,
        max: 100,
        min: -100,
        overImportance: ["RF", "LSTM", "MLP"].map((item) => ({
          label: item,
          importance: _.random(-1, 1, true)
        }))
      })),
    instances: Array(6)
      .fill(0)
      .map((d, i) => ({
        ...mockInstance(),
        features: Array(MOCK_FEATURE_NUM)
          .fill(0)
          .map((d, i) => ({
            label: `s${i + 4}`,
            value: _.random(-100, 100),
            importance: ["RF", "LSTM", "MLP"].map((item) => ({
              label: item,
              value: _.random(-1, 1, true)
            }))
          }))
      }))
  };
};
const MOCK_TIMELINE_LEN = 120;

export const mockFetchInstanceTimeline = (params) => {
  return {
    info: {
      unit: 1,
      timeline: 200
    },
    maxMin: {
      hi: {
        max: 1,
        min: 0
      },
      pred: {
        max: MOCK_MODEL_VALUE_MAX,
        min: -MOCK_MODEL_VALUE_MAX
      },
      importance: {
        max: 40,
        min: -40
      }
    },
    overall: Array(MOCK_TIMELINE_LEN)
      .fill(0)
      .map((d, i) => _.random(0, 1, true)),
    features: Array(MOCK_FEATURE_NUM)
      .fill(0)
      .map((d, i) => {
        return {
          label: "s_" + i,
          value: Array(MOCK_TIMELINE_LEN)
            .fill(0)
            .map(() => _.random(0, 1, true))
        };
      }),
    models: MOCK_MODELS.map((d, i) => {
      return {
        label: d,
        value: Array(MOCK_TIMELINE_LEN)
          .fill(0)
          .map((d, i) => {
            return {
              rul: MOCK_TIMELINE_LEN - i,
              pred: _.random(-MOCK_MODEL_VALUE_MAX, MOCK_MODEL_VALUE_MAX, true),
              importance: Array(MOCK_FEATURE_NUM)
                .fill(0)
                .map((d, i) => ({
                  label: "s_" + i,
                  value: _.random(-40, 40, true)
                })),
              meanPred: _.random(
                -MOCK_MODEL_VALUE_MAX,
                MOCK_MODEL_VALUE_MAX,
                true
              ),
              variance: _.random(0, 1, true)
            };
          })
      };
    })
  };
};
