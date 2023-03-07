import * as d3 from "d3";

export const MARGIN = {
  left: 10,
  top: 20,
  right: 20,
  bottom: 10,
  xGap: 15,
  yGap: 10
};

export const UnitColor = (unitId) => d3.interpolateRdBu(unitId / 100);
