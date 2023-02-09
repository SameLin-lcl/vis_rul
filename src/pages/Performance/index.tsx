import React, { useLayoutEffect, useRef, useState } from "react";
import ViewContainer from "../components/ViewContainer";
import { MAX_PERF_DATA, mockPerfData } from "./mock";
import { DataType } from "./type";
import * as d3 from "d3";
import { COLORS, FONT_SIZE, PRIMARY_COLOR } from "../../style";
import { MARGIN } from "../constant";
import { RectType } from "../type";
const BAR_WIDTH = 10;

export default function Performance(props: any): JSX.Element {
  const { containerStyle } = props;

  const chartRef: any = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [svg, setSVG] = useState(d3.create("svg"));
  const data = mockPerfData;

  useLayoutEffect(() => {
    if (svg !== null && dimensions.width !== 0) {
      draw(data);
      return () => {
        svg.selectAll("*").remove();
      };
    }
  }, [svg, data, dimensions]);

  const drawFeature = (
    data: DataType[],
    rect: {
      left: number;
      top: number;
      right: number;
      bottom: number;
    },
    yPosScale: any,
    MARGIN: any
  ): void => {
    svg
      .append("text")
      .text("Features")
      .attr("x", (rect.right + rect.left) / 2)
      .attr("y", MARGIN.top)
      .attr("text-anchor", "middle")
      .attr("font-size", FONT_SIZE);

    const valueScale = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([
        -(yPosScale.step() - MARGIN.yGap) / 2,
        (yPosScale.step() - MARGIN.yGap) / 2
      ]);

    const xScale = d3
      .scaleLinear()
      .domain([0, MAX_PERF_DATA.showNum])
      .range([rect.left, rect.right]);

    const tooltip = d3
      .select("#app")
      .append("div")
      .style("padding", "5px")
      .style("background", "#3f3f3f")
      .style("color", "#fff")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("top", "-1000px")
      .style("left", "-1000px");

    data.forEach((d: DataType) => {
      const yPos: number = yPosScale(d.model);
      const g = svg.append("g");

      d.features.forEach(({ label, value, variance }, i) => {
        const sg = g
          .append("g")
          .on("mouseover", (e): void => {
            tooltip
              .text(`${String(label)}# ${String(value)}, ${String(variance)}`)
              .style("visibility", "visible")
              .style("top", `${d3.pointer(e, document)[1] - 10}px`)
              .style("left", `${d3.pointer(e, document)[0] + 10}px`);
          })
          .on("mousemove", (e): void => {
            tooltip
              .style("top", `${d3.pointer(e, document)[1] - 10}px`)
              .style("left", `${d3.pointer(e, document)[0] + 10}px`);
          })
          .on("mouseleave", (): void => {
            tooltip
              .style("visibility", "hidden")
              .style("top", "-1000px")
              .style("left", "-1000px");
          });

        sg.append("rect")
          .attr("x", xScale(i))
          .attr("y", yPos)
          .attr("width", 10)
          .attr("height", yPosScale.step() - MARGIN.yGap)
          .style("fill", "#f8f8f8");

        /*****
         *
         * 绘制特征重要性
         */
        sg.append("rect")
          .attr("x", xScale(i))
          .attr(
            "y",
            value >= 0
              ? yPos + valueScale(1) - valueScale(value)
              : yPos + valueScale(1)
          )
          .attr("width", 10)
          .attr("height", Math.abs(valueScale(value)))
          .style("fill", COLORS[i]);

        sg.append("line")
          .attr("x1", xScale(i))
          .attr("x2", xScale(i) + 10)
          .attr(
            "y1",
            value >= 0
              ? yPos + valueScale(1) + valueScale(variance)
              : yPos + valueScale(1) - valueScale(variance)
          )
          .attr(
            "y2",
            value >= 0
              ? yPos + valueScale(1) + valueScale(variance)
              : yPos + valueScale(1) - valueScale(variance)
          )
          .style("stroke", "#aaa");

        sg.append("line")
          .attr("x1", xScale(i) + 5)
          .attr("x2", xScale(i) + 5)
          .attr("y1", yPos + valueScale(1))
          .attr(
            "y2",
            value >= 0
              ? yPos + valueScale(1) + valueScale(variance)
              : yPos + valueScale(1) - valueScale(variance)
          )
          .style("stroke", "#aaa");
      });
    });
  };

  const drawFeatureCircle = (
    data: DataType[],
    rect: {
      left: number;
      top: number;
      right: number;
      bottom: number;
    },
    yPosScale: any
  ): void => {
    const INNER_RADIUS_RATE = 0.4;
    svg
      .append("text")
      .text("Features")
      .attr("x", (rect.right + rect.left) / 2)
      .attr("y", rect.top - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", FONT_SIZE);

    const radius =
      Math.min(rect.right - rect.left, yPosScale.step() - MARGIN.yGap) / 2;

    const radiusScale = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([radius * INNER_RADIUS_RATE, radius]);

    const innerRadiusScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, radius * INNER_RADIUS_RATE]);

    data.forEach((d) => {
      const transform = `translate(${
        rect.left + (rect.right - rect.left) / 2
      }, ${Number(yPosScale(d.model)) + (yPosScale.step() - MARGIN.yGap) / 2})`;

      const anglePiece = (Math.PI * 2) / d.features.length;

      svg
        .append("circle")
        .attr("cx", rect.left + (rect.right - rect.left) / 2)
        .attr(
          "cy",
          Number(yPosScale(d.model)) + (yPosScale.step() - MARGIN.yGap) / 2
        )
        .attr("r", radiusScale(0))
        .style("fill", "transparent")
        .style("stroke", "#e3e3e3");

      const drawInportance = (): void => {
        d.features.forEach((f, i) => {
          const x = Math.sin(i * anglePiece) * radiusScale(f.value);
          const y = Math.cos(i * anglePiece) * radiusScale(f.value);

          const _x = Math.sin(i * anglePiece) * radiusScale(0);
          const _y = Math.cos(i * anglePiece) * radiusScale(0);

          svg
            .append("circle")
            .attr("r", 1)
            .attr("cx", x)
            .attr("cy", y)
            .style("stroke", () => (f.value >= 0 ? "#6fe38c" : "#ffb6a6"))
            .attr("transform", transform);

          svg
            .append("line")
            .attr("x1", x)
            .attr("x2", _x)
            .attr("y1", y)
            .attr("y2", _y)
            .style("stroke-width", 0.7)
            .style("stroke", () => (f.value >= 0 ? "#6fe38c" : "#ffb6a6"))
            .attr("transform", transform);
        });
      };

      const drawVaraince = (): void => {
        // const points = d.features.map(({ variance }, i: number) => {
        //   const x = Math.sin(i * anglePiece) * innerRadiusScale(variance);
        //   const y = Math.cos(i * anglePiece) * innerRadiusScale(variance);
        //
        //   return `${x},${y}`;
        // });
        //
        // svg
        //   .append("polygon")
        //   .attr("points", points.join(" "))
        //   .attr("transform", transform);

        const polygon: any = d3
          .line()
          .curve(d3.curveLinearClosed)
          .x((d: any, i) => {
            return innerRadiusScale(d.variance) * Math.sin(i * anglePiece);
          })
          .y(
            (d: any, i) =>
              innerRadiusScale(d.variance) * Math.cos(i * anglePiece)
          );

        const g = svg.append("g");

        g.selectAll("path")
          .data([d.features])
          .enter()
          .append("path")
          .attr("d", polygon)
          .attr("transform", transform)
          .style("fill", "#ccc");
      };

      drawInportance();
      drawVaraince();
    });
  };

  const drawMainChart = (
    g: any,
    data: DataType[],
    rect: RectType,
    xScale: any,
    yScale: any
  ): void => {
    const rectMargin = 6;
    const prefWidth = xScale.step();
    const rowHeight = yScale.step() - 10;

    const valueScales = Object.fromEntries(
      MAX_PERF_DATA.perf.map(({ label, value }) => [
        label,
        d3
          .scaleLinear()
          .domain([0, value])
          .range([0, prefWidth - rectMargin * 2])
      ])
    );

    data.forEach((d: DataType, rowIndex: number) => {
      d.perf.forEach(({ label, value }, colIndex: number) => {
        const xPos = xScale(label) as number;
        const yPos =
          (yScale(d.model) as number) + rowHeight / 2 - BAR_WIDTH / 2;

        svg
          .append("rect")
          .attr("x", xPos + rectMargin)
          .attr("y", yPos + +FONT_SIZE / 2)
          .attr("width", prefWidth - rectMargin * 2)
          .attr("height", BAR_WIDTH)
          .style("fill", "transparent")
          .attr("stroke", PRIMARY_COLOR)
          .attr("stroke-width", 0.5);

        svg
          .append("rect")
          .attr("x", xPos + rectMargin)
          .attr("y", yPos + +FONT_SIZE / 2)
          .attr("width", valueScales[label](value))
          .attr("height", BAR_WIDTH)
          .style("fill", PRIMARY_COLOR);

        svg
          .append("text")
          .text(value)
          .attr("x", xPos + rectMargin)
          .attr("y", yPos)
          .style("fill", "#555555")
          .attr("font-size", FONT_SIZE - 1);
      });
    });
  };

  const drawLabelTop = (
    g: any,
    data: any[],
    rect: RectType,
    xScale: any,
    yScale: any
  ): void => {
    const prefWidth = xScale.step();

    MAX_PERF_DATA.perf.forEach(({ label: pref }, index) => {
      g.append("text")
        .text(pref)
        .attr("x", (xScale(pref) as number) + prefWidth / 2)
        .attr("y", rect.bottom - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", FONT_SIZE);
    });
  };

  const drawLabelLeft = (
    g: any,
    data: any[],
    rect: RectType,
    xScale: any,
    yScale: any
  ): void => {
    const rowHeight = yScale.step() - 10;

    MAX_PERF_DATA.models.forEach((model, index: number) => {
      g.append("text")
        .text(model)
        .attr("x", rect.right - 5)
        .attr("y", (yScale(model) as number) + rowHeight / 2 + FONT_SIZE / 2)
        .attr("text-anchor", "end")
        .attr("font-size", FONT_SIZE);
    });
  };

  const draw = (data: DataType[]): void => {
    const LABEL_WIDTH = 40;
    const LABEL_TOP_HEIGHT = 40;
    const PREF_CHART_WIDTH = 180;

    const mainRect = {
      left: MARGIN.left + LABEL_WIDTH,
      top: MARGIN.top + LABEL_TOP_HEIGHT,
      bottom: dimensions.height - MARGIN.bottom,
      right: MARGIN.left + LABEL_WIDTH + PREF_CHART_WIDTH,
      xGap: MARGIN.xGap,
      yGap: MARGIN.yGap
    };

    const yPosScale = d3
      .scaleBand()
      .paddingInner(mainRect.yGap)
      .domain([...MAX_PERF_DATA.models, ""])
      .range([mainRect.top, mainRect.bottom]);

    const xPosScale = d3
      .scaleBand()
      .paddingInner(mainRect.xGap)
      .domain([...MAX_PERF_DATA.perf.map((item) => item.label), ""])
      .range([mainRect.left, mainRect.right]);

    drawLabelLeft(
      svg.append("g"),
      [],
      {
        left: MARGIN.left,
        top: mainRect.top,
        right: mainRect.left,
        bottom: mainRect.bottom
      },
      xPosScale,
      yPosScale
    );

    drawLabelTop(
      svg.append("g"),
      [],
      {
        left: mainRect.left,
        top: MARGIN.top,
        right: mainRect.left + PREF_CHART_WIDTH,
        bottom: mainRect.top
      },
      xPosScale,
      yPosScale
    );

    drawMainChart(svg.append("g"), data, mainRect, xPosScale, yPosScale);

    // drawFeature(
    drawFeatureCircle(
      data,
      {
        left: mainRect.right,
        top: mainRect.top,
        right: dimensions.width - MARGIN.right,
        bottom: mainRect.bottom
      },
      yPosScale
    );
  };

  return (
    <ViewContainer
      title={"Performance Overview"}
      containerStyle={containerStyle}
      chartRef={chartRef}
      dimensions={dimensions}
      setDimensions={setDimensions}
      setSVG={setSVG}
    ></ViewContainer>
  );
}
