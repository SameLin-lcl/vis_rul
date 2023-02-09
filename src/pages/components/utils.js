import { MAX_FEATURE_DATA } from "../Feature Analysis/mock";

export const culFeatureImportance = (data) => {
  const importance = Array(MAX_FEATURE_DATA.length)
    .fill(0)
    .map((_, i) => {
      return (
        data.reduce((s, d) => s + Math.abs(d.features[i].importance), 0) /
        data.length
      );
    });

  return importance;
};

export const scaleFunction = (domain, range, widthParam, minWidth) => {
  const restWidth = range[1] - range[0] - widthParam.length * minWidth;
  const paramsSum = widthParam.reduce((a, b) => a + b);
  const paramsRatio = widthParam.map((item) => item / paramsSum);

  const bandWidth = widthParam.map(
    (item, i) => minWidth + restWidth * paramsRatio[i]
  );

  let pos = range[0];
  const posX = bandWidth.map((w) => {
    const res = pos + w / 2;
    pos = pos + w;
    return res;
  });

  const _domain = {};
  for (let i = 0; i < domain[1] - domain[0]; i++) {
    _domain[domain[0] + i] = i;
  }

  return (d, op) => {
    switch (op) {
      case undefined:
        return posX[_domain[d]];
      case "band":
        return bandWidth[_domain[d]];
      case "param":
        return widthParam[_domain[d]];
      default:
        return undefined;
    }
  };
};
