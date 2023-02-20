import { DataType } from "../Scatter/type";
import * as d3 from "d3";
import { UnitColor } from "../constant";

type ScaleType = (x?: number) => number;

export const drawGlyph = (props: {
  svg: any;
  d: DataType;
  xScale: d3.ScaleLinear<number, number, never> | ScaleType;
  yScale: d3.ScaleLinear<number, number, never> | ScaleType;
  radius?: number;
  modelPerf?: number;
  onlyRul?: boolean;
  onlyUnit?: boolean;
  classPrefix?: string;
  event?: any;
}): void => {
  const {
    svg,
    d,
    xScale,
    yScale,
    radius = 8,
    modelPerf = 100,
    onlyRul = false,
    onlyUnit = false,
    classPrefix = "instance-glyph",
    event
  } = props;

  const ARC_IN_RADIUS = radius / (onlyRul ? 8 : 4);
  const ARC_OUT_RADIUS_RUL = radius / (onlyRul ? 3 : 2);
  const ARC_OUT_RADIUS = radius;
  const COLORS = ["#5bd1d7", "#348498", "#3b9a9c", "#a696c8"];
  const ARC_MARGIN = Math.PI * 0.02;

  const handleMouseOver = (e: any): void => {
    d3.select("#tooltip")
      .html(
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        `instance ${String(d.instanceId)}# <br/> RUL: ${String(d.rul)}` +
          d.modelPerf
            .map(
              ({ label, value }: any) =>
                `<br/> ${String(label)}: ${String(value)}`
            )
            .join(" ")
      )
      .style("visibility", "visible")
      .style("top", `${d3.pointer(e, document)[1] - 10}px`)
      .style("left", `${d3.pointer(e, document)[0] + 10}px`);
    event?.mouseOver?.(e, d);
  };

  const handleMouseMove = (e: any): void => {
    d3.select("#tooltip")
      .style("top", `${d3.pointer(e, document)[1] - 10}px`)
      .style("left", `${d3.pointer(e, document)[0] + 10}px`);
    event?.mouseMove?.(e, d);
  };

  const handleMouseLeave = (e: any): void => {
    d3.select("#tooltip")
      .style("visibility", "hidden")
      .style("top", "-1000px")
      .style("left", "-1000px");
    event?.mouseLeave?.(e, d);
  };

  if (onlyUnit) {
    svg
      .append("circle")
      .attr("cx", xScale(d.x))
      .attr("cy", yScale(d.y))
      .attr("r", ARC_IN_RADIUS)
      .attr("fill", UnitColor(d.unitId as number))
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseleave", handleMouseLeave);
    return;
  }

  const arcScale = d3
    .scaleLinear()
    .domain([0, d.rulMax ?? 0])
    .range([Math.PI, Math.PI * (onlyRul ? 3 : 2)]);

  svg
    .append("path")
    .attr("class", `${classPrefix}-${String(d.instanceId ?? 0)}`)
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
        .endAngle(Math.PI * (onlyRul ? 3 : 2))
        .padAngle(0)
        .cornerRadius(0)
    )
    .on("mouseover", handleMouseOver)
    .on("mousemove", handleMouseMove)
    .on("mouseleave", handleMouseLeave);

  svg
    .append("path")
    .attr("class", `${classPrefix}-${String(d.instanceId ?? 0)}`)
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
    )
    .on("mouseover", handleMouseOver)
    .on("mousemove", handleMouseMove)
    .on("mouseleave", handleMouseLeave);

  if (onlyRul) {
    return;
  }

  // 画模型圆弧
  const posScale = d3
    .scaleLinear()
    .domain([0, d.modelPerf.length])
    .range([0, Math.PI]);

  const valueScale = d3
    .scaleLinear()
    .domain([modelPerf, 0])
    .range([ARC_IN_RADIUS, ARC_OUT_RADIUS]);

  d.modelPerf.forEach(({ label, value }, index: number) => {
    svg
      .append("path")
      .attr("class", `${classPrefix}-${String(d.instanceId ?? 0)}`)
      .attr("transform", `translate(${xScale(d.x)}, ${yScale(d.y)})`)
      .attr("fill", COLORS[index])
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(ARC_IN_RADIUS)
          .outerRadius(valueScale(Math.abs(value)))
          .startAngle(posScale(index) + ARC_MARGIN)
          .endAngle(posScale(1 + index) - ARC_MARGIN)
          .padAngle(0)
          .cornerRadius(0)
      )
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseleave", handleMouseLeave);
  });
};
