import { mockNodeData } from "../Scatter/mock";
import _ from "lodash";

const FEATURE_NUM = 14;

export const MAX_FEATURE_DATA = Array(FEATURE_NUM)
  .fill(0)
  .map((d, i) => {
    const maxValue = _.random(-1000, 1000);
    const minValue = _.random(-1000, maxValue);

    return {
      name: `s${i + 1}`,
      overImportance: _.random(-1, 1, true),
      maxValue,
      minValue
    };
  });

export const FEATURE_DATA = Array(6)
  .fill(0)
  .map(() => {
    return {
      id: ~~(Math.random() * 200),
      unit: ~~(Math.random() * 200),
      node: mockNodeData(),
      features: MAX_FEATURE_DATA.map((item) => ({
        // 多个模型的 feature 的 mean
        label: item.label,
        value: _.random(item.minValue, item.maxValue),
        importance: _.random(-1, 1, true)
      }))
    };
  });
