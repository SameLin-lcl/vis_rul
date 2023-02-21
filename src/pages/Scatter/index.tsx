// ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import ViewContainer from "../components/ViewContainer";
import * as d3 from "d3";
import { drawGlyph } from "../components/drawFunction";
import { MARGIN } from "../constant";
import { observer } from "mobx-react";
import { Select, Switch } from "antd";

export default observer(function ScatterView(props: any): JSX.Element {
  const { containerStyle, globalData } = props;

  const chartRef: any = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [svg, setSVG] = useState(d3.create("svg"));
  const [onlyRul, setOnlyRul] = useState(false);
  const [onlyUnit, setOnlyUnit] = useState(false);

  useEffect(() => {
    if (svg !== null && dimensions.width !== 0) {
      if (globalData.instances?.length > 0) {
        drawScatter(svg, globalData.instances, onlyRul, onlyUnit);
      } else {
        svg.append("text").text("no data");
      }
      return () => {
        svg.selectAll("*").remove();
      };
    }
  }, [svg, globalData.instances, dimensions, onlyRul, onlyUnit]);

  const drawScatter = (
    svg: any,
    data: any[],
    onlyRul: boolean,
    onlyUnit: boolean
  ): void => {
    const xScale = d3
      .scaleLinear()
      .domain([
        globalData.instancesMaxMin.x.min,
        globalData.instancesMaxMin.x.max
      ])
      .range([MARGIN.left, dimensions.width - MARGIN.right]);

    const yScale = d3
      .scaleLinear()
      .domain([
        globalData.instancesMaxMin.y.min,
        globalData.instancesMaxMin.y.max
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

    const updateChart = ({ selection }: any, isSelected = false): any[] => {
      const selectedInstance: any = [];
      if (selection?.length > 0) {
        const [[x0, y0], [x1, y1]] = selection;

        const filterFunction = (d: any): boolean => {
          const res =
            x0 <= xScale(d.x) &&
            xScale(d.x) < x1 &&
            y0 <= yScale(d.y) &&
            yScale(d.y) < y1;
          if (res) {
            selectedInstance.push(d.instanceId);
          }
          return res;
        };

        if (isSelected) {
          d3.selectAll(".instance-pca")
            .classed("selected-instance", false)
            .classed("selecting-instance", false)
            .filter(filterFunction)
            .classed("selected-instance", true);
        } else {
          d3.selectAll(".instance-pca").classed(
            "selecting-instance",
            filterFunction
          );
        }
      }
      return selectedInstance;
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
            const selectedInstances = updateChart({ selection }, true);
            globalData.updateSelectedInstance(selectedInstances);
            d3.brush().move(d3.select(this), null);
          }
        })
    );

    // 画图

    const genUnitPath = d3
      .line()
      .x((d: any, i: number) => xScale(d.x))
      .y((d: any, i: number) => yScale(d.y));

    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgb(0,255,0)");

    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#f00");

    const mouseOver = (e: any, d: any): void => {
      const unitData = data.filter((item) => item.unitId === d.unitId);
      svg
        .selectAll(".unit-path")
        .data([unitData])
        .enter()
        .append("path")
        .attr("class", "unit-path")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("d", genUnitPath)
        .style("fill", "none")
        .attr("stroke", "url(#line-gradient)")
        // .style("stroke", "#f00")
        .style("stroke-width", 1);
    };

    const mouseLeave = (e: any, d: any): void => {
      svg.selectAll(".unit-path").remove();
    };

    const mouseClick = (e: any, d: any): void => {
      const isSelected: boolean = globalData.updateSelectedInstance(
        d.instanceId
      );
      d3.select(`.instance-pca-${String(d.instanceId)}`).classed(
        "selected-instance",
        !isSelected
      );
      console.log(`instance-pca-${String(d.instanceId)}`, !isSelected);
      console.log(
        d3
          .select(`.instance-pca-${String(d.instanceId)}`)
          .classed("selected-instance")
      );
    };

    data.forEach((d) => {
      drawGlyph({
        svg,
        d,
        xScale,
        yScale,
        modelPerf: Math.max(
          globalData.instancesMaxMin.modelPerf?.max,
          Math.abs(globalData.instancesMaxMin.modelPerf?.max)
        ),
        radius: 12,
        onlyRul,
        onlyUnit,
        classPrefix: "instance-pca",
        event: { mouseOver, mouseLeave, click: mouseClick }
      });
    });
  };

  return (
    <ViewContainer
      title={"Dataset Overview"}
      containerStyle={containerStyle}
      chartRef={chartRef}
      dimensions={dimensions}
      setDimensions={setDimensions}
      setSVG={setSVG}
    >
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 10,
          fontSize: "12px"
        }}
      >
        <div>
          only rul:{" "}
          <Switch
            size={"small"}
            checked={onlyRul}
            onChange={(b) => {
              setOnlyRul(b);
            }}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          only unit:{" "}
          <Switch
            size={"small"}
            checked={onlyUnit}
            onChange={(b) => {
              setOnlyUnit(b);
            }}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          window:{" "}
          <Select
            style={{ width: 60 }}
            dropdownMatchSelectWidth={false}
            size={"small"}
            value={globalData.win}
            onChange={(v) => globalData.updateWin(v)}
            options={[1, 2, 5, 10, 20].map((item) => ({ value: item }))}
          />
        </div>
      </div>
    </ViewContainer>
  );
});
