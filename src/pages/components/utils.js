export const culFeatureImportance = (featureInfo) => {
  const importance = featureInfo.map((feature, i) => {
    return (
      feature.overImportance.reduce((s, d) => s + Math.abs(d.importance), 0) /
      feature.overImportance.length
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

  console.log(bandWidth, posX);

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

export function debounce(func, time) {
  let timer;
  const context = this;
  const args = [...arguments];
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, time);
  };
}
