import _ from "lodash";

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
      features: { max: 100, min: 0 },
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
      features: Array(10)
        .fill(0)
        .map((d, i) => ({
          label: "s_" + i,
          value: _.random(0, 1, true),
          variance: _.random(0, 1, true)
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

export const mockFetchInstances = (params) => {
  return {
    maxMin: {
      x: { max: 100, min: 0 },
      y: { max: 100, min: 0 },
      modelPref: { max: 100, min: 0 }
    },
    instances: Array(100)
      .fill(0)
      .map((d, i) => ({
        instanceId: i,
        x: _.random(0, 100),
        y: _.random(0, 100),
        rul: _.random(0, 100),
        rulMax: 100,
        modelPerf: (params.models.length > 0
          ? params.models
          : ["RF", "LSTM", "MLP"]
        )?.map((item) => ({
          label: item,
          value: _.random(0, 100)
        }))
      }))
  };
};
