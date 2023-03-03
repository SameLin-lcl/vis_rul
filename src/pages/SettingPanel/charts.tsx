// @ts-nocheck
import ViewContainer from "../components/ViewContainer";
import React, { useLayoutEffect, useRef, useState } from "react";
import { IProps } from "../components/types";
import * as d3 from "d3";
import { MOCK_UNITS_DATA } from "./mock";
import { MAX_FEATURE_DATA } from "../FeatureAnalysis/mock";

export const ScatterChart = ({ units, unitsMaxMin }: any): JSX.Element => {
  const chartRef: any = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [svg, setSVG] = useState(d3.create("svg"));
  const data = MOCK_UNITS_DATA;

  useLayoutEffect(() => {
    if (svg !== null && dimensions.width !== 0) {
      if (units.length > 0) {
        draw(units);
      } else {
        svg.append("text").text("no data");
      }
      return () => {
        svg.selectAll("*").remove();
      };
    }
  }, [svg, units, dimensions]);

  const draw = (
    data: Array<{ unitId: string | number; x: number; y: number; rul: number }>
  ): void => {
    const LABEL_BOTTOM_HEIGHT = 2;
    const LABEL_LEFT_WIDTH = 2;
    const CHART_PADDING = 15;

    const mainRect = {
      left: CHART_PADDING + LABEL_LEFT_WIDTH,
      top: CHART_PADDING,
      right: dimensions.width - CHART_PADDING,
      bottom: dimensions.height - CHART_PADDING - LABEL_BOTTOM_HEIGHT
    };

    const xScale = d3
      .scaleLinear()
      .domain([unitsMaxMin.x.min, unitsMaxMin.x.max])
      .range([mainRect.left, mainRect.right]);
    const yScale = d3
      .scaleLinear()
      .domain([unitsMaxMin.y.min, unitsMaxMin.y.max])
      .range([mainRect.bottom - 10, mainRect.top]);

    const colorScaler = d3
      .scaleLinear()
      .domain([unitsMaxMin.rul.min, unitsMaxMin.rul.max])
      .range(["#ffb142", "#218c74"]);

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

    /**
     * 刷选
     */

    const updateChart = ({ selection }: any, isSelected = false): void => {
      if (selection !== undefined) {
        const [[x0, y0], [x1, y1]] = selection;

        const filterFunction = (d: any): boolean => {
          return (
            x0 <= xScale(d.x) &&
            xScale(d.x) < x1 &&
            y0 <= yScale(d.y) &&
            yScale(d.y) < y1
          );
        };

        if (isSelected) {
          d3.selectAll(".unit-pca")
            .classed("selecting-unit", false)
            .filter(filterFunction)
            .classed("selected-unit", true);
        } else {
          d3.selectAll(".unit-pca").classed("selecting-unit", filterFunction);
        }
      }
    };

    svg.call(
      d3
        .brush()
        .extent([
          [0, 0],
          [dimensions.width, dimensions.height]
          // [xScale.range()[0], yScale.range()[0]],
          // [xScale.range()[1], yScale.range()[1]]
        ])
        .on("start brush", (e) => updateChart(e))
        .on("end", function ({ selection }): void {
          if (selection !== undefined) {
            updateChart({ selection }, true);
            d3.brush().move(d3.select(this), null);
          }
        })
    );

    // 画点

    svg
      .selectAll()
      .data(data)
      .enter()
      .append("circle")
      .attr("data-id", (d) => d.unitId)
      .attr("class", (d) => `unit-pca unit-${d.unitId}`)
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 2)
      .attr("fill", (d) => colorScaler(d.rul))
      .style("cursor", "pointer")
      .on("mouseover", (e, d) => {
        d3.select("#tooltip")
          .html(`unit ${String(d.unitId)}# <br/> Lifetime: ${String(d.rul)}`)
          .style("visibility", "visible")
          .style("top", `${d3.pointer(e, document)[1] - 10}px`)
          .style("left", `${d3.pointer(e, document)[0] + 10}px`);
        d3.select(`.unit-pca.unit-${d.unitId}`).attr("r", 5);
      })
      .on("mousemove", (e): void => {
        d3.select("#tooltip")
          .style("top", `${d3.pointer(e, document)[1] - 10}px`)
          .style("left", `${d3.pointer(e, document)[0] + 10}px`);
      })
      .on("mouseleave", (e, d): void => {
        d3.select("#tooltip")
          .style("visibility", "hidden")
          .style("top", "-1000px")
          .style("left", "-1000px");
        d3.select(`.unit-pca.unit-${d.unitId}`).attr("r", 2);
      })
      .on("click", function (e, d) {
        const isSelected = d3.select(this).classed("selected-unit");
        d3.select(this).classed("selected-unit", !isSelected);
      });
  };

  return (
    <ViewContainer
      chartRef={chartRef}
      dimensions={dimensions}
      setDimensions={setDimensions}
      setSVG={setSVG}
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
