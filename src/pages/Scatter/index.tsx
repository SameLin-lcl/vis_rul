// ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import ViewContainer from "../components/ViewContainer";
import * as d3 from "d3";
import { MAX_SCATTER_DATA, mockScatterData } from "./mock";
import { DataType } from "./type";
import { drawGlyph } from "../components/drawFunction";
import { MARGIN } from "../constant";

export default function ScatterView(props: any): JSX.Element {
  const { containerStyle } = props;

  const chartRef: any = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [svg, setSVG] = useState(null);
  const data = mockScatterData;

  useEffect(() => {
    if (svg !== null && dimensions.width !== 0) {
      drawScatter(svg, data);
      return () => {
        // @ts-expect-error
        svg?.selectAll("*").remove();
      };
    }
  }, [svg, data, dimensions]);

  const drawScatter = (svg: any, data: any[]): void => {
    const xScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return d.x;
        })
      ])
      .range([MARGIN.left, dimensions.width - MARGIN.right]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return d.y;
        })
      ])
      .range([dimensions.height - MARGIN.bottom, MARGIN.top + 10]);

    // 绘制坐标系
    // const xLine = svg
    //   .append("g")
    //   .attr("transform", `translate(0, ${dimensions.height - MARGIN.bottom})`)
    //   .call(d3.axisBottom(xScale));
    //
    // const yLine = svg
    //   .append("g")
    //   .attr("transform", `translate(${MARGIN.left}, 0)`)
    //   .call(d3.axisLeft(yScale));

    data.forEach((d) => drawGlyph(svg, d, xScale, yScale));
    // svg
    //   .selectAll("circle")
    //   .data(data)
    //   .enter()
    //   .append("circle")
    //   .attr("cx", (d, i) => xScale(d.x))
    //   .attr("cy", (d, i) => yScale(d.y))
    //   .attr("r", 5)
    //   .attr("fill", "#d1eeee");
  };

  return (
    <ViewContainer
      title={"Dataset Overview"}
      containerStyle={containerStyle}
      chartRef={chartRef}
      dimensions={dimensions}
      setDimensions={setDimensions}
      setSVG={setSVG}
    ></ViewContainer>
  );
}
