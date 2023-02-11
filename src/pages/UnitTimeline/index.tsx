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
import { COLORS, FONT_SIZE } from "../../style";
import { MAX_FEATURE_DATA } from "../FeatureAnalysis/mock";

const TOP_CHART_HEIGHT = 100;
const MODEL_LABEL_HEIGHT = 20;
const MODEL_LINE_HEIGHT = 100;

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

  const drawChartTop = (g: any, data: any, rect: RectType): void => {
    const featuresHeight = 30;
    const rectPadding = 5;

    const height = rect.bottom - rect.top - featuresHeight;

    const subHeight = height / (+data.features.length + 2);

    /**
     * feature Rect
     */

    const xScaleFeature = d3
      .scaleBand()
      .domain(MAX_FEATURE_DATA.map((d: any, i: number) => d.name))
      .range([rect.left, rect.right]);

    const colorScale = d3.scaleLinear().domain([0, 1]).range(["#aaa", "#888"]);

    const rectWidth = xScaleFeature.step() - rectPadding * 2;

    g.selectAll()
      .data(MAX_FEATURE_DATA)
      .enter()
      .append("rect")
      .attr("x", (d: any) => +xScaleFeature(d.name) + rectPadding)
      .attr("y", rect.top)
      .attr("width", rectWidth)
      .attr("height", featuresHeight - rectPadding * 2)
      .attr("fill", (d: any) => colorScale(d.overImportance));

    /**
     * model perf
     */

    g.append("rect")
      .attr("x", rect.left)
      .attr("y", rect.top + featuresHeight)
      .attr("width", rect.right - rect.left)
      .attr("height", rect.bottom - rect.top - featuresHeight)
      .style("fill", "transparent")
      .attr("stroke", "#909090")
      .attr("stroke-width", 0.5);

    const valueScale = d3.scaleLinear().domain([0, 1]).range([0, subHeight]);

    const xScale = d3
      .scaleLinear()
      .domain([0, data.overall.length - 1])
      .range([rect.left, rect.right]);

    // g.append("g").call(d3.axisBottom(xScale));

    const lastPath = [];

    const genOverAreaPath = d3
      .area()
      .x((d: any, i: number) => xScale(i))
      .y0(
        (d: any) =>
          rect.top + featuresHeight + subHeight * 2 - valueScale(d) * 2
      )
      .y1((d: any) => {
        const res =
          rect.top + featuresHeight + subHeight * 2 + valueScale(d) * 2;
        lastPath.push(res);
        return res;
      })
      .curve(d3.curveBumpX);

    const genFeatureAreaPath = d3
      .area()
      .x((d: any, i: number) => xScale(i))
      .y0((d: any, i: number) => lastPath[i])
      .y1((d: any, i: number) => {
        const res = +lastPath[i] + valueScale(d);
        lastPath[i] = res;
        return res;
      })
      .curve(d3.curveBumpX);

    g.selectAll()
      .data([data.overall])
      .enter()
      .append("path")
      .attr("d", genOverAreaPath)
      .style("fill", "#7c7c7c")
      .style("stroke-width", 1);

    g.selectAll()
      .data(data.features)
      // .data([data.features[0]])
      .enter()
      .append("path")
      .attr("d", (d: any, i: number) => genFeatureAreaPath(d))
      .style("fill", (d: any, i: number) => COLORS[i])
      .style("stroke-width", 1);
  };

  const drawModelChart = (g: any, data: any[], rect: RectType): void => {
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length])
      .range([rect.left, rect.right]);

    const width = (rect.right - rect.left) / data.length;

    const valueScale = d3
      .scaleLinear()
      .domain([-modelValueMax, modelValueMax])
      .range([rect.top, rect.top + MODEL_LINE_HEIGHT]);

    const varianceScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([rect.top, rect.top + MODEL_LINE_HEIGHT]);

    const backColorScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range(["#fff", "#aaa"]);

    const lineColorScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range(["#fff", "#ff4816"]);

    // g.append("g").call(d3.axisBottom(xScale));

    g.selectAll()
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", rect.top)
      .attr("width", width)
      .attr("height", MODEL_LINE_HEIGHT)
      .style("fill", (d: any) => backColorScale(d.variance))
      .style("opacity", 0.3);

    g.selectAll()
      .data(data)
      .enter()
      .append("line")
      .attr("x1", (d, i) => xScale(i))
      .attr("x2", (d, i) => xScale(i) + width)
      .attr("y1", (d, i) => varianceScale(d.variance))
      .attr("y2", (d, i) => varianceScale(d.variance))
      .style("stroke", (d) => lineColorScale(d.variance));
    // .style("fill", (d: any) => {
    //   console.log(d);
    //   return backColorScale(d.variance);
    // })
    // .style("opacity", 0.3);

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
      .style("stroke", "rgb(127,127,127)")
      .style("stroke-dasharray", 2);

    /**
     * 马赛克
     */
    const colorScales = MAX_FEATURE_DATA.map((d, i) =>
      d3.scaleLinear().domain([0, 1]).range(["#fff", COLORS[i]])
    );

    data.forEach((item, index) => {
      g.selectAll()
        .data(item.importance)
        .enter()
        .append("rect")
        .attr("x", xScale(index))
        .attr("y", (d, i) => rect.top + MODEL_LINE_HEIGHT + 10 + width * i)
        .attr("width", width)
        .attr("height", width)
        .attr("fill", (d, i) => colorScales[i](d));
    });
  };

  const draw = (data: any): void => {
    const mainRect = {
      left: MARGIN.left,
      top: MARGIN.top + TOP_CHART_HEIGHT + 20,
      right: dimensions.width - MARGIN.right,
      bottom: dimensions.height - MARGIN.bottom
    };

    drawChartTop(svg.append("g"), data, {
      left: mainRect.left,
      top: MARGIN.top + 20,
      right: mainRect.right,
      bottom: mainRect.top
    });

    const yScale = d3
      .scaleLinear()
      .domain([0, models.length])
      .range([mainRect.top + 20, mainRect.bottom]);

    const height =
      (mainRect.bottom - mainRect.top) / models.length - MODEL_LABEL_HEIGHT;

    data.models.forEach((item: any, index: number) => {
      const gChart = svg.append("g");
      gChart
        .append("text")
        .text(models[index])
        .attr("x", mainRect.left)
        .attr("y", yScale(index) + FONT_SIZE)
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
      title={"Timeline Analysis"}
      containerStyle={containerStyle}
      chartRef={chartRef}
      dimensions={dimensions}
      setDimensions={setDimensions}
      setSVG={setSVG}
    ></ViewContainer>
  );
}
