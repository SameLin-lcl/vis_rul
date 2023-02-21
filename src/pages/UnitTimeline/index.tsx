// @ts-nocheck
import React, { useLayoutEffect, useRef, useState } from "react";
import ViewContainer from "../components/ViewContainer";
import * as d3 from "d3";
import { RectType } from "../type";
import { MARGIN } from "../constant";
import { FONT_SIZE } from "../../style";
import { observer } from "mobx-react";
import { Space } from "antd";

const TOP_CHART_HEIGHT = 60;
const MODEL_LABEL_HEIGHT = 20;

export default observer(function UnitTimeline(props: any): JSX.Element {
  const { containerStyle, globalData } = props;

  const chartRef: any = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [svg, setSVG] = useState(d3.create("svg"));

  useLayoutEffect(() => {
    console.log("DRAWING globalData upDate");
    if (svg !== null && dimensions.width !== 0) {
      console.log("DRAWING  upDate");
      if (globalData.timelineData !== undefined) {
        console.log("DRAWING");
        draw(globalData.timelineData);
      } else {
        svg.append("text").text("no data");
      }
      return () => {
        svg.selectAll("*").remove();
      };
    }
  }, [svg, dimensions, globalData.timelineDataRandom]);

  const drawChartTop = (
    g: any,
    {
      features,
      overall
    }: {
      features: any[];
      overall: any[];
    },
    rect: RectType
  ): void => {
    const featuresHeight = 10;

    const height = rect.bottom - rect.top - featuresHeight;

    // const subHeight = height / (+features.length + 4);
    const subHeight = height / 6;

    /**
     * feature Rect
     */

    // const xScaleFeature = d3
    //   .scaleBand()
    //   .domain(features.map((d: any, i: number) => d.label))
    //   .range([rect.left, rect.right]);
    //
    // const colorScale = d3.scaleLinear().domain([0, 1]).range(["#aaa", "#888"]);
    //
    // const rectWidth = xScaleFeature.step() - rectPadding * 2;
    //
    // g.selectAll()
    //   .data(MAX_FEATURE_DATA)
    //   .enter()
    //   .append("rect")
    //   .attr("x", (d: any) => +xScaleFeature(d.name) + rectPadding)
    //   .attr("y", rect.top)
    //   .attr("width", rectWidth)
    //   .attr("height", featuresHeight - rectPadding * 2)
    //   .attr("fill", (d: any) => colorScale(d.overImportance));

    /**
     * model perf
     */
    //
    // g.append("rect")
    //   .attr("x", rect.left)
    //   .attr("y", rect.top + featuresHeight)
    //   .attr("width", rect.right - rect.left)
    //   .attr("height", rect.bottom - rect.top - featuresHeight)
    //   .style("fill", "transparent")
    //   .attr("stroke", "#909090")
    //   .attr("stroke-width", 0.5);

    const valueScale = d3.scaleLinear().domain([0, 1]).range([0, subHeight]);

    const xScale = d3
      .scaleLinear()
      .domain([0, overall.length - 1])
      .range([rect.left, rect.right]);

    // g.append("g").call(d3.axisBottom(xScale));

    const lastPath = [];

    const genOverAreaPath = d3
      .area()
      .x((d: any, i: number) => xScale(i))
      .y0(
        (d: any) =>
          rect.top + featuresHeight + subHeight * 4 - valueScale(d) * 4
      )
      .y1((d: any) => {
        const res =
          rect.top + featuresHeight + subHeight * 4 + valueScale(d) * 4;
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

    const handleMouseOver = function (e: any, d: any): void {
      d3.select(this).attr("stroke", "#ff8181");
      d3.select("#tooltip")
        .html(d.label ?? "overall")
        .style("visibility", "visible")
        .style("top", `${d3.pointer(e, document)[1] - 10}px`)
        .style("left", `${d3.pointer(e, document)[0] + 10}px`);
    };
    const handleMouseMove = function (e: any): void {
      d3.select("#tooltip")
        .style("top", `${d3.pointer(e, document)[1] - 10}px`)
        .style("left", `${d3.pointer(e, document)[0] + 10}px`);
    };
    const handleMouseLeave = function (e: any): void {
      d3.select(this).attr("stroke", "#fff");
    };

    g.selectAll()
      .data([overall])
      .enter()
      .append("path")
      .attr("d", genOverAreaPath)
      .style("fill", "#bfdaee")
      .style("stroke-width", 1)
      .on("mouseenter", handleMouseOver)
      .on("mousemove", handleMouseMove)
      .on("mouseleave", handleMouseLeave);

    // g.selectAll()
    //   .data(features)
    //   // .data([data.features[0]])
    //   .enter()
    //   .append("path")
    //   .attr("d", (d: any, i: number) => genFeatureAreaPath(d.value))
    //   .style("fill", (d: any, i: number) => "#a9afb5")
    //   .attr("stroke", "#fff")
    //   .style("stroke-width", 0.4)
    //   .on("mouseenter", handleMouseOver)
    //   .on("mousemove", handleMouseMove)
    //   .on("mouseleave", handleMouseLeave);
  };

  const drawModelChart = (
    g: any,
    data: any[],
    rect: RectType,
    maxMin: any
  ): void => {
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length])
      .range([rect.left, rect.right]);

    const width = (rect.right - rect.left) / data.length;

    const mscHeight = 5;

    const modelLineHeight =
      rect.bottom - rect.top - 10 - mscHeight * data[0].importance.length;

    const valueScale = d3
      .scaleLinear()
      .domain([maxMin.pred.min, maxMin.pred.max])
      .range([rect.top, rect.top + modelLineHeight]);

    const varianceScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([rect.top, rect.top + modelLineHeight]);

    const backColorScale = d3
      .scaleLinear()
      .domain([1, 0])
      .range(["#fff", "#aaa"]);

    const lineColorScale = d3
      .scaleLinear()
      .domain([1, 0])
      .range(["#ffd4d4", "#ff3500"]);

    // g.append("g").call(d3.axisBottom(xScale));

    g.selectAll()
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", rect.top)
      .attr("width", width)
      .attr("height", modelLineHeight)
      .style("fill", (d: any) => backColorScale(d.variance))
      .style("opacity", 0.3);

    g.selectAll()
      .data(data)
      .enter()
      .append("line")
      .attr("x1", (d, i) => xScale(i))
      .attr("x2", (d, i) => xScale(i) + width)
      .attr("y1", (d, i) => valueScale(d.meanPred))
      .attr("y2", (d, i) => valueScale(d.meanPred))
      .style("stroke", (d) => lineColorScale(d.variance));
    // .style("fill", (d: any) => {
    //   console.log(d);
    //   return backColorScale(d.variance);
    // })
    // .style("opacity", 0.3);
    //
    g.append("path")
      .attr(
        "d",
        d3.line()(
          [].concat(
            ...data.map((d, i) => [
              [xScale(i), valueScale(d.pred)],
              [xScale(i + 1), valueScale(d.pred)]
            ])
          )
        )
      )
      .style("fill", "none")
      .style("stroke", "rgb(0,114,255)");

    g.append("line")
      .attr("x1", rect.left)
      .attr("x2", rect.right)
      .attr("y1", rect.top + modelLineHeight / 2)
      .attr("y2", rect.top + modelLineHeight / 2)
      .style("stroke", "rgb(127,127,127)")
      .style("stroke-dasharray", 2);

    /**
     * 马赛克
     */
    const posColorScales = data[0].importance.map((d, i) =>
      d3
        .scaleLinear()
        .domain([0, maxMin.importance.max])
        .range(["#ffffff", "#91a3c9"])
    );

    const negColorScales = data[0].importance.map((d, i) =>
      d3
        .scaleLinear()
        .domain([0, maxMin.importance.min])
        .range(["#ffffff", "#f27272"])
    );

    console.log(maxMin.importance.min, maxMin.importance.max);

    data.forEach((item, index) => {
      g.selectAll()
        .data(item.importance)
        .enter()
        .append("rect")
        .attr("x", xScale(index))
        .attr("y", (d, i) => rect.top + modelLineHeight + 10 + mscHeight * i)
        .attr("width", width)
        .attr("height", 3)
        .attr("fill", (d, i) =>
          d.value > 0 ? posColorScales[i](d.value) : negColorScales[i](d.value)
        )
        .on("mouseover", function (e, d) {
          d3.select("#tooltip")
            .html(
              `RUL: ${String(item.rul)} <br/> Feature: ${String(
                d.label
              )}<br/> Importance: ${String(d.value)}`
            )
            .style("visibility", "visible")
            .style("top", `${d3.pointer(e, document)[1] - 10}px`)
            .style("left", `${d3.pointer(e, document)[0] + 10}px`);
          d3.select(this).style("stroke", "#f00");
        })
        .on("mouseleave", function (e, d) {
          d3.select("#tooltip")
            .style("visibility", "hidden")
            .style("top", "-1000px")
            .style("left", "-1000px");
          d3.select(this).style("stroke", "none");
        });
    });
  };

  const draw = ({
    models: data,
    features,
    overall,
    maxMin,
    info
  }: {
    data: any[];
    features: any[];
    overall: any[];
    maxMin: any;
    info?: any;
  }): void => {
    const mainRect = {
      left: MARGIN.left,
      top: MARGIN.top + TOP_CHART_HEIGHT + 20,
      right: dimensions.width - MARGIN.right,
      bottom: dimensions.height
    };

    drawChartTop(
      svg.append("g"),
      { features, overall },
      {
        left: mainRect.left,
        top: MARGIN.top + 20,
        right: mainRect.right,
        bottom: mainRect.top
      }
    );

    const yScale = d3
      .scaleLinear()
      .domain([0, data.length])
      .range([mainRect.top + 20, mainRect.bottom]);

    const height =
      (mainRect.bottom - mainRect.top) / data.length - MODEL_LABEL_HEIGHT;
    //
    data.forEach((item: any, index: number) => {
      const gChart = svg.append("g");
      gChart
        .append("text")
        .text(item.label)
        .attr("x", mainRect.left)
        .attr("y", yScale(index) + FONT_SIZE)
        .style("font-size", FONT_SIZE * 1.2);

      drawModelChart(
        gChart,
        item.value,
        {
          left: mainRect.left,
          top: yScale(index) + MODEL_LABEL_HEIGHT,
          right: mainRect.right,
          bottom: yScale(index) + MODEL_LABEL_HEIGHT + height - 20
        },
        maxMin
      );
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
    >
      {globalData.timelineData !== undefined && (
        <Space
          style={{
            position: "absolute",
            right: 30,
            top: 30
          }}
        >
          <span>Unit: {globalData.timelineData.info.unit}</span>
          <span>Timeline: {globalData.timelineData.info.timeline}</span>
        </Space>
      )}
    </ViewContainer>
  );
});
