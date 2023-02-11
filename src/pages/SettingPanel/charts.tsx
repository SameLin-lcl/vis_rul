import ViewContainer from "../components/ViewContainer";
import React, { useLayoutEffect, useRef, useState } from "react";
import { IProps } from "../components/types";
import * as d3 from "d3";
import { MOCK_UNITS_DATA } from "./mock";
import { MAX_FEATURE_DATA } from "../FeatureAnalysis/mock";

export const ScatterChart = (props: IProps): JSX.Element => {
  const chartRef: any = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [svg, setSVG] = useState(d3.create("svg"));
  const data = MOCK_UNITS_DATA;

  useLayoutEffect(() => {
    if (svg !== null && dimensions.width !== 0) {
      draw(data);
      return () => {
        svg.selectAll("*").remove();
      };
    }
  }, [svg, data, dimensions]);

  const draw = (data: Array<{ name: string; x: number; y: number }>): void => {
    const LABEL_BOTTOM_HEIGHT = 2;
    const LABEL_LEFT_WIDTH = 2;
    const CHART_PADDING = 5;

    const mainRect = {
      left: CHART_PADDING + LABEL_LEFT_WIDTH,
      top: CHART_PADDING,
      right: dimensions.width - CHART_PADDING,
      bottom: dimensions.height - CHART_PADDING - LABEL_BOTTOM_HEIGHT
    };

    const xScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([mainRect.left, mainRect.right]);
    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([mainRect.top, mainRect.bottom]);

    // svg
    //   .append("g")
    //   .call(d3.axisLeft(yScale).tickValues([]).tickSize(1))
    //   .attr(
    //     "transform",
    //     "translate(" + String(mainRect.left - LABEL_LEFT_WIDTH) + ",0)"
    //   )
    //   .selectAll("path")
    //   .attr("stroke", "#aaa");
    //
    // svg
    //   .append("g")
    //   .call(d3.axisBottom(xScale).tickValues([]).tickSize(3))
    //   .attr(
    //     "transform",
    //     "translate(0," + String(mainRect.bottom + LABEL_BOTTOM_HEIGHT) + ")"
    //   )
    //   .selectAll("path")
    //   .attr("stroke", "#aaa");

    svg
      .selectAll()
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 2)
      .attr("fill", "#aaa");
  };

  return (
    <ViewContainer
      chartRef={chartRef}
      dimensions={dimensions}
      setDimensions={setDimensions}
      setSVG={setSVG}
      {...props}
    />
  );
};

export const BarChart = (props: IProps): JSX.Element => {
  const chartRef: any = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [svg, setSVG] = useState(d3.create("svg"));
  const data = MAX_FEATURE_DATA;

  useLayoutEffect(() => {
    if (svg !== null && dimensions.width !== 0) {
      draw(data);
      return () => {
        svg.selectAll("*").remove();
      };
    }
  }, [svg, data, dimensions]);

  const draw = (data: any[]): void => {
    const LABEL_BOTTOM_HEIGHT = 20;
    const LABEL_LEFT_WIDTH = 2;
    const CHART_PADDING = 5;

    const mainRect = {
      left: CHART_PADDING + LABEL_LEFT_WIDTH,
      top: CHART_PADDING,
      right: dimensions.width - CHART_PADDING,
      bottom: dimensions.height - CHART_PADDING - LABEL_BOTTOM_HEIGHT
    };

    const width = (mainRect.right - mainRect.left) / data.length;
    const padding = width * 0.2;

    const xScale = d3
      .scaleBand()
      .domain(data.map((item) => item.name))
      .range([mainRect.left, mainRect.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, mainRect.bottom - mainRect.top]);

    const axisBottom = svg
      .append("g")
      .call(d3.axisBottom(xScale).tickSize(3))
      .attr("transform", "translate(0," + String(mainRect.bottom + 5) + ")");
    axisBottom.selectAll("path").attr("stroke", "#fff");
    axisBottom
      .selectAll("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-45)");

    svg
      .selectAll()
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: any, i: number) => (xScale(d.name) ?? 0) + padding)
      .attr("y", (d: any) => mainRect.bottom - yScale(d.variance))
      .attr("width", width - padding * 2)
      .attr("height", (d: any) => yScale(d.variance));
  };

  return (
    <ViewContainer
      chartRef={chartRef}
      dimensions={dimensions}
      setDimensions={setDimensions}
      setSVG={setSVG}
      {...props}
    />
  );
};
