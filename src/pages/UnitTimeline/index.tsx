// @ts-nocheck
import React, { useLayoutEffect, useRef, useState } from "react";
import ViewContainer from "../components/ViewContainer";
import * as d3 from "d3";
import {
  MOCK_FEATURE_NUM,
  MOCK_MODEL_VALUE_MAX,
  MOCK_MODELS,
  MOCK_TIMELINE_DATA
} from "./mock";
import { RectType } from "../type";
import { MARGIN } from "../constant";
import { FONT_SIZE } from "../../style";

const TOP_CHART_HEIGHT = 40;
const MODEL_LABEL_HEIGHT = 20;
const MODEL_LINE_HEIGHT = 50;

export default function UnitTimeline(props: any): JSX.Element {
  const { containerStyle } = props;

  const chartRef: any = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [svg, setSVG] = useState(d3.create("svg"));
  const data = MOCK_TIMELINE_DATA;
  const featureNum = MOCK_FEATURE_NUM;
  const modelValueMax = MOCK_MODEL_VALUE_MAX;
  const models = MOCK_MODELS;

  useLayoutEffect(() => {
    if (svg !== null && dimensions.width !== 0) {
      draw(data);
      return () => {
        svg.selectAll("*").remove();
      };
    }
  }, [svg, data, dimensions]);

  const drawChartTop = (g: any, data: number[], rect: RectType): void => {
    const height = rect.bottom - rect.top;

    g.append("rect")
      .attr("x", rect.left)
      .attr("y", rect.top)
      .attr("width", rect.right - rect.left)
      .attr("height", rect.bottom - rect.top)
      .style("fill", "transparent")
      .attr("stroke", "#909090")
      .attr("stroke-width", 0.5);

    const valueScale = d3.scaleLinear().domain([0, 1]).range([0, height]);
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([rect.left, rect.right]);

    // g.append("g").call(d3.axisBottom(xScale));

    const genAreaPath = d3
      .area()
      .x((d: any, i: number) => xScale(i))
      .y0((d: any) => rect.top + height / 2 + valueScale(d) / 2)
      .y1((d: any) => rect.top + height / 2 - valueScale(d) / 2)
      .curve(d3.curveBumpX);
    // .line()
    // .x((d: any, i: number) => xScale(i))
    // .y((d: any) => valueScale(d));

    g.selectAll()
      .data([data])
      .enter()
      .append("path")
      .attr("d", genAreaPath)
      .style("fill", "#7c7c7c")
      .style("stroke-width", 1);
  };

  const drawModelChart = (g: any, data: any[], rect: RectType): void => {
    /**
     * TEST
     */
    g.append("rect")
      .attr("x", rect.left)
      .attr("y", rect.top)
      .attr("width", rect.right - rect.left)
      .attr("height", rect.bottom - rect.top)
      .style("fill", "transparent")
      .attr("stroke", "#000")
      .attr("stroke-width", 0.5);

    const xScale = d3
      .scaleLinear()
      .domain([0, data.length])
      .range([rect.left, rect.right]);

    const valueScale = d3
      .scaleLinear()
      .domain([-modelValueMax, modelValueMax])
      .range([rect.top, rect.top + MODEL_LINE_HEIGHT]);

    g.append("g").call(d3.axisBottom(xScale));

    g.append("rect")
      .attr("x", rect.left)
      .attr("y", rect.top)
      .attr("width", rect.right - rect.left)
      .attr("height", MODEL_LINE_HEIGHT)
      .style("fill", "transparent")
      .attr("stroke", "#000")
      .attr("stroke-width", 0.5);

    console.log(
      [].concat(
        ...data.map((d, i) => [
          [xScale(i), valueScale(d.value)],
          [xScale(i + 1), valueScale(d.value)]
        ])
      )
    );

    g.append("path")
      .attr(
        "d",
        d3.line()(
          [].concat(
            ...data.map((d, i) => [
              [xScale(i), valueScale(d.value)],
              [xScale(i + 1), valueScale(d.value)]
            ])
          )
        )
      )
      .style("fill", "none")
      .style("stroke", "rgb(0,114,255)");

    g.append("line")
      .attr("x1", rect.left)
      .attr("x2", rect.right)
      .attr("y1", rect.top + MODEL_LINE_HEIGHT / 2)
      .attr("y2", rect.top + MODEL_LINE_HEIGHT / 2)
      .style("stroke", "rgb(0,114,255)");
  };

  const draw = (data: any): void => {
    const mainRect = {
      left: MARGIN.left,
      top: MARGIN.top + TOP_CHART_HEIGHT,
      right: dimensions.width - MARGIN.right,
      bottom: dimensions.height - MARGIN.bottom
    };

    drawChartTop(svg.append("g"), data.overall, {
      left: mainRect.left,
      top: MARGIN.top + 10,
      right: mainRect.right,
      bottom: mainRect.top
    });

    const yScale = d3
      .scaleLinear()
      .domain([0, models.length])
      .range([mainRect.top, mainRect.bottom]);

    const height =
      (mainRect.bottom - mainRect.top) / models.length - MODEL_LABEL_HEIGHT;

    data.models.forEach((item: any, index: number) => {
      const gChart = svg.append("g");
      gChart
        .append("text")
        .text(models[index])
        .attr("x", mainRect.left)
        .attr("y", yScale(index) + FONT_SIZE * 1.6)
        .style("font-size", FONT_SIZE * 1.2);

      drawModelChart(gChart, item, {
        left: mainRect.left,
        top: yScale(index) + MODEL_LABEL_HEIGHT,
        right: mainRect.right,
        bottom: yScale(index) + MODEL_LABEL_HEIGHT + height
      });
    });
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
