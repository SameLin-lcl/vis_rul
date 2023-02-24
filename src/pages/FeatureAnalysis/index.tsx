import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ViewContainer from "../components/ViewContainer";
import * as d3 from "d3";
import { FEATURE_DATA } from "./mock";
import { FeatureType } from "./type";
import { RectType } from "../type";
import { COLORS, FONT_SIZE, PRIMARY_COLOR } from "../../style";
import { drawGlyph } from "../components/drawFunction";
import { scaleFunction } from "../components/utils";
import { MARGIN } from "../constant";
import { observer } from "mobx-react";

const LABEL_WIDTH = 90;
const FEATURE_LABEL_HEIGHT = 100;
const minBandWidth = 2;

export default observer(function FeatureView(props: any): JSX.Element {
  const { containerStyle, globalData } = props;

  const chartRef: any = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [svg, setSVG] = useState(d3.create("svg"));
  const data = FEATURE_DATA;

  useEffect(() => {
    globalData.updateInstanceFeatures();
  }, []);

  useLayoutEffect(() => {
    console.log("LOADING FEATURE");
    if (svg !== null && dimensions.width !== 0) {
      if (globalData.instanceImportance.length > 0) {
        draw(
          globalData.instanceImportance,
          globalData.featureImportance,
          globalData.importanceMaxMin
        );
      } else {
        svg.append("text").text("no data");
      }
      return () => {
        console.log("REMOVE FEATURE");
        svg.selectAll("*").remove();
      };
    }
  }, [svg, data, dimensions, globalData.instanceImportance]);

  const handleSelectInstance = (e: any, d: any): void => {
    globalData.updateSelectedInput(d.instanceId);
  };

  const drawLabelTop = (
    g: any,
    data: any[],
    maxMin: any,
    rect: RectType,
    xScale: any,
    yScale: d3.ScaleLinear<number, number, never>
  ): void => {
    g.selectAll("text")
      .data([{ name: "unit" }, ...data])
      .enter()
      .append("text")
      .text((d: any) => d.name)
      .attr("x", (_: any, i: number) => xScale(i))
      .attr("y", rect.bottom - FONT_SIZE / 2)
      .attr("font-size", FONT_SIZE * 0.7)
      .attr("text-anchor", "middle");

    data.forEach((d: any, i: number) => {
      const width: number = xScale(i + 1, "band");

      const xRectBand = d3
        .scaleBand()
        .domain(d.overImportance.map((item: any) => item.label))
        .range([
          xScale(i + 1) - width / 2 + width * 0.05,
          +xScale(i + 1) + width / 2 - width * 0.05
        ]);

      const middleHeight = (rect.bottom - 12 + rect.top) / 2;

      const maxAbsImportance = Math.max(
        Math.abs(maxMin.importance.max),
        Math.abs(maxMin.importance.min)
      );
      console.log(maxAbsImportance);

      const posValueScale = d3
        .scaleLinear()
        .domain([0, maxAbsImportance])
        .range([middleHeight, rect.top]);
      const negValueScale = d3
        .scaleLinear()
        .domain([0, -maxAbsImportance])
        .range([middleHeight, rect.bottom - 12]);

      g.append("rect")
        .attr("x", xRectBand.range()[0])
        .attr("y", rect.top)
        .attr("width", xRectBand.range()[1] - xRectBand.range()[0])
        .attr("height", rect.bottom - 12 - rect.top)
        .attr("fill", "#fff")
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", 1)
        .on("mouseover", (e: any) => {
          d3.select("#tooltip")
            .html(
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              `${String(d.name)} # ` +
                d.overImportance
                  .map(
                    (item: any) =>
                      `<br /> ${String(item.label)} : ${String(
                        item.importance
                      )}`
                  )
                  .join(" ")
            )
            .style("visibility", "visible")
            .style("top", `${d3.pointer(e, document)[1] - 10}px`)
            .style("left", `${d3.pointer(e, document)[0] + 10}px`);
        })
        .on("mousemove", (e: any): void => {
          d3.select("#tooltip")

            .style("top", `${d3.pointer(e, document)[1] - 10}px`)
            .style("left", `${d3.pointer(e, document)[0] + 10}px`);
        })
        .on("mouseleave", (): void => {
          d3.select("#tooltip")
            .style("visibility", "hidden")
            .style("top", "-1000px")
            .style("left", "-1000px");
        });

      g.selectAll()
        .data(d.overImportance)
        .enter()
        .append("rect")
        .attr(
          "x",
          (d: any, i: number) =>
            Number(xRectBand(d.label)) + xRectBand.step() * 0.05
        )
        .attr("y", (d: any, i: number) =>
          d.importance > 0 ? posValueScale(d.importance) : middleHeight
        )
        .attr("width", xRectBand.step() * 0.9)
        .attr("height", (d: any, i: number) => {
          // console.log(
          //   d.importance,
          //   maxMin.min,
          //   maxMin.max,
          //   valueScale(d.importance)
          // );
          return d.importance > 0
            ? middleHeight - posValueScale(d.importance)
            : negValueScale(d.importance) - middleHeight;
        })
        .attr("fill", (d: any, i: number) => COLORS[i]);

      g.append("line")
        .attr("x1", xScale(i + 1) - width / 2 + width * 0.1)
        .attr("y1", middleHeight)
        .attr("x2", +xScale(i + 1) + width / 2 - width * 0.1)
        .attr("y2", middleHeight)
        .attr("stroke", COLORS[i])
        .attr("stroke-width", 0.2);
    });
  };

  const drawLabelLeft = (
    g: any,
    data: any[],
    rect: RectType,
    xScale: any,
    yScale: d3.ScaleLinear<number, number, never>,
    handleMouseOver: any,
    handleMouseLeave: any
  ): void => {
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
        .attr("class", `feat-id-${String(d.instanceId)} feat-label`)
        .style("fill", "#e5f0ff")
        .style("opacity", 0);

      gBlock
        .append("text")
        .text(`U.${String(d.unitId)}`)
        .attr("x", rect.left)
        .attr("y", yScale(i) + FONT_SIZE / 2)
        .attr("font-size", FONT_SIZE * 0.8);

      drawGlyph({
        svg: gBlock,
        d,
        xScale: () => rect.right - glyphRadius - 10,
        yScale: () => yScale(i),
        radius: glyphRadius,
        backRef: true,
        event: { dbclick: handleSelectInstance }
      });
    });
  };

  const drawChart = (
    g: any,
    data: any[],
    features: any[],
    maxMin: any,
    rect: RectType,
    xScale: any,
    yScale: d3.ScaleLinear<number, number, never>,
    handleMouseOver: any,
    handleMouseLeave: any
  ): void => {
    const valueScales: any[] = [];
    [
      {
        min: 0.5,
        max: data.length + 0.5
      },
      ...features
    ].forEach((d: any, i) => {
      const valueScale = d3
        .scaleLinear()
        .domain([d.min, d.max])
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
            d3.axisLeft(valueScale).tickSize(0).tickValues([])
            // .tickValues([d.min, d.max])
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
        return d3.line().curve(d3.curveCatmullRom.alpha(0.5))([
          [xScale(0) - 5, valueScales[0](index + 1)],
          [xScale(0), valueScales[0](index + 1)],
          ...d.features.map((item: any, i: number) => {
            return [xScale(i + 1), valueScales[i + 1](item.value)];
          })
        ]);
      })
      .style("fill", "none")
      .style("stroke", "#a5caeb")
      .style("stroke-width", 1)
      .attr("class", (d: any) => `feat-id-${String(d.instanceId)} feat-line`)
      .on("mouseover", handleMouseOver)
      .on("mouseleave", handleMouseLeave);

    /**
     * 画圆
     */

    const calRadio = (d: any, i: number): number => {
      const width = xScale(i + 1, "band") / 2;
      const maxValue = maxMin.maxAbsImportance[i];

      return width * (d.meanAbsImportance / maxValue) * 0.8;
    };

    data.forEach((item, index) => {
      g.selectAll()
        .data(item.features)
        .enter()
        .append("circle")
        .attr("cx", (d: any, i: number) => xScale(i + 1))
        .attr("cy", (d: any, i: number) => valueScales[i + 1](d.value))
        .attr("r", calRadio)
        .style("fill", "#c4def0")
        .style("opacity", 0.4)
        .attr(
          "class",
          (d: any, i: number) =>
            `feat-id-${String(item.instanceId)} feat-circle feat-${i}`
        );
    });
  };

  const draw = (data: FeatureType[], featureInfo: any[], maxMin: any): void => {
    const mainRect = {
      left: LABEL_WIDTH + MARGIN.left,
      top: FEATURE_LABEL_HEIGHT + MARGIN.top,
      right: dimensions.width - MARGIN.right - 10,
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

    const scaleFunc = scaleFunction(
      [1, featureInfo.length + 2],
      [mainRect.left + minBandWidth + 10, mainRect.right],
      maxMin.meanAbsImportance,
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

    const handleMouseOver = (e: any, d: any): void => {
      d3.selectAll(`.feat-line.feat-id-${String(d.instanceId)}`).style(
        "stroke",
        "rgb(23,0,255)"
      );
      d3.selectAll(`.feat-label.feat-id-${String(d.instanceId)}`).style(
        "opacity",
        1
      );

      // 画内圆
      const circles = d3
        .selectAll(`.feat-circle.feat-id-${String(d.instanceId)}`)
        .style("opacity", 0.6);

      circles.each(function (d: any): void {
        const context = d3.select(this);
        const x = Number(context.attr("cx"));
        const y = Number(context.attr("cy"));
        const r = Number(context.attr("r"));

        const data = {
          name: d.label,
          children: d.importance.map((item: any) => ({
            name: item.label,
            value: Math.abs(item.value),
            raw: item.value
          }))
        };
        const pack = d3.pack().size([r * 2, r * 2]);
        const root = d3.hierarchy(data).sum((d: any) => Math.abs(d.value));
        // @ts-expect-error
        const nodes = pack(root).descendants();

        svg
          .selectAll()
          .data(nodes)
          .join("circle")
          .attr("class", "join-glyph")
          .attr("cx", (d: any) => d.x)
          .attr("cy", (d: any) => d.y)
          .attr("r", (d: any) => d.r)
          .attr("transform", (d: any) => `translate(${x - r}, ${y - r})`)
          // .attr("r", (d: any) => {
          //   return d.r * r;
          // })
          .attr("fill", (d: any, i) => {
            return d.children === undefined ? COLORS[i - 1] : "#fff";
          })
          // .attr("stroke", (d: any, i) => {
          //   return d.children === undefined
          //     ? d.data.raw > 0
          //       ? "#f6d8ab"
          //       : "#f1b6af"
          //     : "#a0a0a0";
          // })
          // .attr("stroke-width", (d: any, i) => {
          //   return d.children === undefined ? 3 : 0.5;
          // })
          .attr("opacity", 1);
        // .on("mouseover", (e: any, d: any) => {
        //   d3.select("#tooltip")
        //     .html(d.data.name)
        //     .style("visibility", "visible")
        //     .style("top", `${d3.pointer(e, document)[1] - 10}px`)
        //     .style("left", `${d3.pointer(e, document)[0] + 10}px`);
        // });

        svg
          .selectAll()
          .data(nodes)
          .join("rect")
          .attr("class", "join-glyph")
          .attr("x", (d: any) => d.x - d.r * 0.5)
          .attr("y", (d: any) => d.y - d.r * 0.1)
          .attr("transform", (d: any) => `translate(${x - r}, ${y - r})`)
          .attr("width", (d: any) => {
            return d.children === undefined ? d.r : 0;
          })
          .attr("height", (d: any) => d.r * 0.2)
          .attr("fill", "#fff");

        svg
          .selectAll()
          .data(nodes)
          .join("rect")
          .attr("class", "join-glyph")
          .attr("x", (d: any) => d.x - d.r * 0.1)
          .attr("y", (d: any) => d.y - d.r * 0.5)
          .attr("transform", (d: any) => `translate(${x - r}, ${y - r})`)
          .attr("width", (d: any) => d.r * 0.2)
          .attr("height", (d: any) => {
            return d.children === undefined && d.data.raw > 0 ? d.r : 0;
          })
          .attr("fill", "#fff");
      });
    };

    const handleMouseLeave = (e: any, d: any): void => {
      d3.selectAll(`.feat-line.feat-id-${String(d.instanceId)}`).style(
        "stroke",
        "rgba(55,152,255,0.67)"
      );
      d3.selectAll(`.feat-label.feat-id-${String(d.instanceId)}`).style(
        "opacity",
        0
      );
      d3.selectAll(`.feat-circle.feat-id-${String(d.instanceId)}`).style(
        "opacity",
        0.2
      );
      d3.selectAll(".join-glyph").remove();
    };

    drawLabelTop(
      svg.append("g"),
      featureInfo,
      maxMin,
      {
        left: mainRect.left,
        top: MARGIN.top + 8,
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
      yScale,
      handleMouseOver,
      handleMouseLeave
    );
    //
    drawChart(
      svg.append("g"),
      data,
      featureInfo,
      maxMin,
      mainRect,
      xScale,
      yScale,
      handleMouseOver,
      handleMouseLeave
    );
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
});
