import React, { useLayoutEffect, useRef, useState } from "react";
import ViewContainer from "../components/ViewContainer";
import * as d3 from "d3";
import { FEATURE_DATA, MAX_FEATURE_DATA } from "./mock";
import { FeatureType } from "./type";
import { RectType } from "../type";
import { FONT_SIZE, PRIMARY_COLOR } from "../../style";
import { drawGlyph } from "../components/drawFunction";
import { culFeatureImportance, scaleFunction } from "../components/utils";
import { MARGIN } from "../constant";

const LABEL_WIDTH = 90;
const FEATURE_LABEL_HEIGHT = 30;
const minBandWidth = 2;

export default function FeatureView(props: any): JSX.Element {
  const { containerStyle } = props;

  const chartRef: any = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [svg, setSVG] = useState(d3.create("svg"));
  const data = FEATURE_DATA;

  useLayoutEffect(() => {
    if (svg !== null && dimensions.width !== 0) {
      draw(data);
      return () => {
        svg.selectAll("*").remove();
      };
    }
  }, [svg, data, dimensions]);

  const handleMouseOver = (e: any, d: any): void => {
    d3.selectAll(`.feat-line.feat-id-${String(d.id)}`).style(
      "stroke",
      "rgb(23,0,255)"
    );
    d3.selectAll(`.feat-label.feat-id-${String(d.id)}`).style("opacity", 1);
    d3.selectAll(`.feat-circle.feat-id-${String(d.id)}`).style("opacity", 0.6);
  };

  const handleMouseLeave = (e: any, d: any): void => {
    d3.selectAll(`.feat-line.feat-id-${String(d.id)}`).style(
      "stroke",
      "rgba(55,152,255,0.67)"
    );
    d3.selectAll(`.feat-label.feat-id-${String(d.id)}`).style("opacity", 0);
    d3.selectAll(`.feat-circle.feat-id-${String(d.id)}`).style("opacity", 0.2);
  };

  const drawLabelTop = (
    g: any,
    data: any[],
    rect: RectType,
    xScale: any,
    yScale: d3.ScaleLinear<number, number, never>
  ): void => {
    /**
     * TEST
     */
    // g.append("rect")
    //   .attr("x", rect.left)
    //   .attr("y", rect.top)
    //   .attr("width", rect.right - rect.left)
    //   .attr("height", rect.bottom - rect.top)
    //   .style("fill", "transparent")
    //   .attr("stroke", "#000")
    //   .attr("stroke-width", 0.5);

    g.selectAll("text")
      .data([{ name: "unit" }, ...data])
      .enter()
      .append("text")
      .text((d: any) => d.name)
      .attr("x", (_: any, i: number) => xScale(i))
      .attr("y", (rect.bottom + rect.top) / 2 + FONT_SIZE / 2)
      .attr("font-size", FONT_SIZE * 0.7)
      .attr("text-anchor", "middle");
  };

  const drawLabelLeft = (
    g: any,
    data: any[],
    rect: RectType,
    xScale: any,
    yScale: d3.ScaleLinear<number, number, never>
  ): void => {
    /**
     * TEST
     */
    // g.append("rect")
    //   .attr("x", rect.left)
    //   .attr("y", rect.top)
    //   .attr("width", rect.right - rect.left)
    //   .attr("height", rect.bottom - rect.top)
    //   .style("fill", "transparent")
    //   .attr("stroke", "#000")
    //   .attr("stroke-width", 0.5);

    const labelHeight = yScale(1) - yScale(0);
    const glyphRadius = Math.min(30, labelHeight / 2 - 5);

    data.forEach((d, i) => {
      const gBlock = g
        .append("g")
        .on("mouseenter", () => handleMouseOver(undefined, d))
        .on("mouseleave", () => handleMouseLeave(undefined, d));

      gBlock
        .append("rect")
        .attr("x", rect.left - 5)
        .attr("y", yScale(i) - labelHeight / 2 + 2)
        .attr("width", LABEL_WIDTH)
        .attr("height", labelHeight - 4)
        .attr("class", `feat-id-${String(d.id)} feat-label`)
        .style("fill", "#e5f0ff")
        .style("opacity", 0);

      gBlock
        .append("text")
        .text(`U.${String(d.unit)}`)
        .attr("x", rect.left)
        .attr("y", yScale(i) + FONT_SIZE / 2)
        .attr("font-size", FONT_SIZE * 0.8);

      drawGlyph(
        gBlock,
        d.node,
        () => rect.right - glyphRadius - 10,
        () => yScale(i),
        glyphRadius
      );
    });
  };

  const drawChart = (
    g: any,
    data: any[],
    rect: RectType,
    xScale: any,
    yScale: d3.ScaleLinear<number, number, never>
  ): void => {
    const valueScales: any[] = [];
    [
      {
        minValue: 0.5,
        maxValue: data.length + 0.5
      },
      ...MAX_FEATURE_DATA
    ].forEach((d: any, i) => {
      const valueScale = d3
        .scaleLinear()
        .domain([d.minValue, d.maxValue])
        .range([rect.top + 10, rect.bottom - 10]);

      valueScales.push(valueScale);

      const gAxis = g
        .append("g")
        .attr("transform", `translate(${String(xScale(i))}, ${0})`);

      if (i === 0) {
        gAxis
          .call(
            d3
              .axisLeft(valueScale)
              .tickSize(0)
              .ticks(5)
              .tickFormat(() => "")
          )
          .selectAll("text")
          .style("font-size", 8);
      } else {
        gAxis
          .call(
            d3
              .axisLeft(valueScale)
              .tickSize(0)
              .tickValues([d.minValue, d.maxValue])
          )
          .selectAll("text")
          .style("font-size", 8)
          .style("text-anchor", "middle")
          .attr("dx", 3)
          .attr("dy", (d: any, i: number) => (i === 0 ? -2 : 8))
          .attr("color", PRIMARY_COLOR);
      }

      gAxis.style("color", "#999").style("stroke-width", 0.6);
    });

    /**
     * 画线
     */
    g.selectAll()
      .data(data)
      .enter()
      .append("path")
      .attr("d", (d: any, index: number) => {
        return d3.line()([
          [xScale(0) - 5, valueScales[0](index + 1)],
          [xScale(0), valueScales[0](index + 1)],
          ...d.features.map((item: any, i: number) => {
            return [xScale(i + 1), valueScales[i + 1](item.value)];
          })
        ]);
      })
      .style("fill", "none")
      .style("stroke", "rgba(55,152,255,0.67)")
      .style("stroke-width", 1)
      .attr("class", (d: any) => `feat-id-${String(d.id)} feat-line`)
      .on("mouseover", handleMouseOver)
      .on("mouseleave", handleMouseLeave);

    /**
     * 画圆
     */

    const calRadio = (d: any, i: number): number => {
      const width = xScale(i + 1, "band") / 2;
      const meanValue = xScale(i + 1, "param");

      return width * (Math.abs(d.importance) / meanValue);
    };

    data.forEach((item, index) => {
      g.selectAll()
        .data(item.features)
        .enter()
        .append("circle")
        .attr("cx", (d: any, i: number) => xScale(i + 1))
        .attr("cy", (d: any, i: number) => valueScales[i + 1](d.value))
        .attr("r", calRadio)
        .style("fill", "rgba(255,141,141)")
        .style("opacity", 0.2)
        .attr(
          "class",
          (d: any, i: number) =>
            `feat-id-${String(item.id)} feat-circle feat-${i}`
        );
    });
  };

  const draw = (data: FeatureType[]): void => {
    const mainRect = {
      left: LABEL_WIDTH + MARGIN.left,
      top: FEATURE_LABEL_HEIGHT + MARGIN.top,
      right: dimensions.width - MARGIN.right,
      bottom: dimensions.height - MARGIN.bottom
    };

    const yScale = d3
      .scaleLinear()
      .domain([-0.5, data.length - 0.5])
      .range([mainRect.top + 10, mainRect.bottom - 10]);

    // const xScale = d3
    //   .scaleLinear()
    //   .domain([-1, MAX_FEATURE_DATA.length + 1])
    //   .range([mainRect.left, mainRect.right]);

    const featureImportance = culFeatureImportance(data);
    const scaleFunc = scaleFunction(
      [1, MAX_FEATURE_DATA.length + 2],
      [mainRect.left + minBandWidth + 10, mainRect.right],
      featureImportance,
      minBandWidth
    );

    // 获取 bandScaler 的 band 中间位置，或者band宽度
    const xScale = (x: number, op: undefined | "band" | "param"): number => {
      if (x === 0) {
        return op === undefined ? mainRect.left : 0;
      } else {
        return scaleFunc(x, op);
      }
    };

    drawLabelTop(
      svg.append("g"),
      MAX_FEATURE_DATA,
      {
        left: mainRect.left,
        top: MARGIN.top,
        right: mainRect.right,
        bottom: mainRect.top
      },
      xScale,
      yScale
    );

    drawLabelLeft(
      svg.append("g"),
      data,
      {
        left: MARGIN.left,
        top: mainRect.top,
        right: mainRect.left,
        bottom: mainRect.bottom
      },
      xScale,
      yScale
    );

    drawChart(svg.append("g"), data, mainRect, xScale, yScale);
  };

  return (
    <ViewContainer
      title={"Feature Analysis"}
      containerStyle={containerStyle}
      chartRef={chartRef}
      dimensions={dimensions}
      setDimensions={setDimensions}
      setSVG={setSVG}
    ></ViewContainer>
  );
}
