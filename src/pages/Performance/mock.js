import _ from "lodash";

const MAX_PERF_DATA = {
  models: ["RF", "LSTM", "SVR", "XGB"],
  perf: ["RSME", "score", "r2"].map((item) => ({ label: item, value: 100 })),
  showNum: 14,
  features: Array(14)
    .fill(0)
    .map((_, i) => `s_${i}`)
};

const mock = (model) => {
  const features = MAX_PERF_DATA.features.map((f) => ({
    label: f,
    value: Math.round(_.random(-1, 1, true) * 100) / 100,
    variance: Math.round(_.random(0, 1, true) * 100) / 100
  }));
  // features.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  return {
    model,
    perf: MAX_PERF_DATA.perf.map((item) => ({
      label: item.label,
      value: Math.round(_.random(0, item.value, true) * 100) / 100
    })),
    features: features.slice(0, MAX_PERF_DATA.showNum)
  };
};

const mockPerfData = MAX_PERF_DATA.models.map((model) => mock(model));
export { mockPerfData, MAX_PERF_DATA };
