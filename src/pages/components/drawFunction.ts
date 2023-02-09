import { DataType } from "../Scatter/type";
import * as d3 from "d3";
import { MAX_SCATTER_DATA } from "../Scatter/mock";

type ScaleType = (x?: number) => number;

export const drawGlyph = (
  svg: any,
  d: DataType,
  xScale: d3.ScaleLinear<number, number, never> | ScaleType,
  yScale: d3.ScaleLinear<number, number, never> | ScaleType,
  size: number = 1
): void => {
  const ARC_IN_RADIUS = 2 * size;
  const ARC_OUT_RADIUS_RUL = 4 * size;
  const ARC_OUT_RADIUS = 8 * size;
  const COLORS = ["#5bd1d7", "#348498", "#3b9a9c", "#a696c8"];
  const ARC_MARGIN = Math.PI * 0.02;

  const arcScale = d3
    .scaleLinear()
    .domain([0, MAX_SCATTER_DATA.rul])
    .range([Math.PI, Math.PI * 2]);

  svg
    .append("path")
    .attr("transform", `translate(${xScale(d.x)}, ${yScale(d.y)})`)
    .attr("fill", "transparent")
    .attr("stroke-width", "0.5")
    .attr("stroke", "gray")
    .attr(
      "d",
      d3
        .arc()
        .innerRadius(ARC_IN_RADIUS)
        .outerRadius(ARC_OUT_RADIUS_RUL)
        .startAngle(Math.PI)
        .endAngle(Math.PI * 2)
        .padAngle(0)
        .cornerRadius(0)
    );

  svg
    .append("path")
    .attr("transform", `translate(${xScale(d.x)}, ${yScale(d.y)})`)
    .attr("fill", "gray")
    .attr(
      "d",
      d3
        .arc()
        .innerRadius(ARC_IN_RADIUS)
        .outerRadius(ARC_OUT_RADIUS_RUL)
        .startAngle(Math.PI)
        .endAngle(arcScale(d.rul))
        .padAngle(0)
        .cornerRadius(0)
    );

  // 画模型圆弧
  const posScale = d3
    .scaleLinear()
    .domain([0, MAX_SCATTER_DATA.modelNum])
    .range([0, Math.PI]);

  const valueScale = d3
    .scaleLinear()
    .domain([0, MAX_SCATTER_DATA.modelPerf])
    .range([ARC_IN_RADIUS, ARC_OUT_RADIUS]);

  d.modelPerf.forEach((data, index: number) => {
    svg
      .append("path")
      .attr("transform", `translate(${xScale(d.x)}, ${yScale(d.y)})`)
      .attr("fill", COLORS[index])
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(ARC_IN_RADIUS)
          .outerRadius(valueScale(data))
          .startAngle(posScale(index) + ARC_MARGIN)
          .endAngle(posScale(1 + index) - ARC_MARGIN)
          .padAngle(0)
          .cornerRadius(0)
      );
  });
};
