import _ from "lodash";

export const MAX_SCATTER_DATA = {
  rul: 150,
  x: 100,
  y: 100,
  modelNum: 3,
  modelPerf: 20
};

export const mockNodeData = () => {
  return {
    x: _.random(MAX_SCATTER_DATA.x),
    y: _.random(MAX_SCATTER_DATA.y),
    rul: _.random(MAX_SCATTER_DATA.rul),
    modelPerf: Array(MAX_SCATTER_DATA.modelNum)
      .fill(0)
      .map(() => _.random(MAX_SCATTER_DATA.modelPerf))
  };
};

const mockScatterData = Array(100).fill(0).map(mockNodeData); // 100个点
export { mockScatterData };
