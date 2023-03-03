import { DataType } from "../Scatter/type";
import * as d3 from "d3";
import { UnitColor } from "../constant";
import { COLORS } from "../../style";

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
  backRef?: boolean;
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
    backRef = true,
    classPrefix = "instance-glyph",
    event
  } = props;

  const ARC_IN_RADIUS = radius / (onlyRul ? 8 : 4);
  const ARC_OUT_RADIUS_RUL = radius / (onlyRul ? 3 : 2);
  const ARC_OUT_RADIUS = radius;
  const ARC_MARGIN = Math.PI * 0.02;

  const g = svg.append("g");

  const handleMouseOver = (e: any, useEvent = true): void => {
    d3.select("#tooltip")
      .html(
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        `instance ${String(d.instanceId)}# <br/> Unit: ${String(
          d.unitId
        )} <br/> RUL: ${String(d.rul)}` +
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
    useEvent && event?.mouseOver?.(e, d);
  };

  const handleMouseMove = (e: any, useEvent = true): void => {
    d3.select("#tooltip")
      .style("top", `${d3.pointer(e, document)[1] - 10}px`)
      .style("left", `${d3.pointer(e, document)[0] + 10}px`);
    useEvent && event?.mouseMove?.(e, d);
  };

  const handleMouseLeave = (e: any, useEvent = true): void => {
    d3.select("#tooltip")
      .style("visibility", "hidden")
      .style("top", "-1000px")
      .style("left", "-1000px");

    useEvent && event?.mouseLeave?.(e, d);
  };

  const handleClick = function (e: any): void {
    event?.click?.(e, d);
  };

  const handleDbClick = (e: any): void => {
    event?.dbclick?.(e, d);
  };

  if (onlyUnit) {
    g.append("circle")
      .attr("cx", xScale(d.x))
      .attr("cy", yScale(d.y))
      .attr("r", ARC_IN_RADIUS)
      .attr("fill", UnitColor(d.unitId as number))
      .attr(
        "class",
        `${classPrefix} ${classPrefix}-${String(d.instanceId ?? 0)}`
      )
      .on("mouseover", (e: any) => handleMouseOver(e, false))
      .on("mousemove", (e: any) => handleMouseMove(e, false))
      .on("mouseleave", (e: any) => handleMouseLeave(e, false))
      .on("click", handleClick)
      .on("dblclick", handleDbClick);
    return;
  }

  // 画 RUL
  //
  // const defs = svg.append("defs");
  // const clipPath = defs.append("clipPath").attr("id", "myClip");
  //
  // const rulScale = d3
  //   .scaleLinear()
  //   .domain([0, d.rulMax ?? 0])
  //   .range([ARC_IN_RADIUS * 2, 0]);
  //
  // clipPath
  //   .append("circle")
  //   .attr("cx", ARC_IN_RADIUS)
  //   .attr("cy", ARC_IN_RADIUS)
  //   .attr("r", ARC_IN_RADIUS);
  //
  // svg
  //   .append("rect")
  //   .attr("x", 0)
  //   .attr("y", rulScale(d.rul))
  //   .attr(
  //     "transform",
  //     `translate(${xScale(d.x) - ARC_IN_RADIUS}, ${
  //       yScale(d.y) - ARC_IN_RADIUS
  //     })`
  //   )
  //   .attr("width", ARC_IN_RADIUS * 2)
  //   .attr("height", ARC_IN_RADIUS * 2)
  //   .attr("fill", "#b2b2b2")
  //   .attr("clip-path", "url(#myClip)");
  // return;

  const arcScale = d3
    .scaleLinear()
    .domain([0, d.rulMax ?? 0])
    .range([Math.PI, Math.PI * (onlyRul ? 3 : 2)]);

  g.append("path")
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
    .attr("class", `${classPrefix} ${classPrefix}-${String(d.instanceId ?? 0)}`)
    .on("mouseover", handleMouseOver)
    .on("mousemove", handleMouseMove)
    .on("mouseleave", handleMouseLeave)
    .on("click", handleClick)
    .on("dblclick", handleDbClick);

  g.append("path")
    .attr("transform", `translate(${xScale(d.x)}, ${yScale(d.y)})`)
    .attr("fill", "#bdc3c7")
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
    .on("mouseout", handleMouseLeave);

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

  if (backRef) {
    g.append("path")
      .attr("transform", `translate(${xScale(d.x)}, ${yScale(d.y)})`)
      .attr("fill", "transparent")
      .attr("stroke-width", "0.3")
      .attr("stroke", "gray")
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(ARC_IN_RADIUS)
          .outerRadius(ARC_OUT_RADIUS)
          .startAngle(0)
          .endAngle(Math.PI)
          .padAngle(0)
          .cornerRadius(0)
      )
      .on("mouseover", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseout", handleMouseLeave);
  }

  d.modelPerf.forEach(({ label, value }, index: number) => {
    g.append("path")
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
      .on("mouseout", handleMouseLeave);
  });

  g.datum(d)
    .attr("class", `${classPrefix} ${classPrefix}-${String(d.instanceId ?? 0)}`)
    // .on("mouseover", handleMouseOver)
    // .on("mousemove", handleMouseMove)
    // .on("mouseout", handleMouseLeave)
    .on("click", handleClick)
    .on("dblclick", handleDbClick);
};
