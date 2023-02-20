import * as d3 from "d3-scale";

export const MARGIN = {
  left: 10,
  top: 20,
  right: 20,
  bottom: 10,
  xGap: 15,
  yGap: 10
};

export const UnitColor = d3
  .scaleLinear()
  .domain([0, 33])
  .range(["#ff0000", "#00ff00"]);
