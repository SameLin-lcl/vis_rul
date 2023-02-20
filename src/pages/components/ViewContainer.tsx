import { IProps } from "./types";
import React, { useEffect, useLayoutEffect } from "react";
import * as d3 from "d3";
import { debounce } from "./utils";

export default function ViewContainer(props: IProps): JSX.Element {
  const {
    containerStyle,
    chartRef,
    dimensions,
    setDimensions,
    setSVG,
    containerClass,
    title
  } = props;

  useEffect(() => {
    const updateDimensions = (): void => {
      setDimensions({
        width: chartRef.current.offsetWidth,
        height: chartRef.current.offsetHeight
      });
    };

    const debouncedUpdateDimensions = debounce(updateDimensions, 500);

    if (chartRef !== undefined && typeof setDimensions === "function") {
      updateDimensions();
      window.addEventListener("resize", debouncedUpdateDimensions);
      return () => {
        window.removeEventListener("resize", debouncedUpdateDimensions);
      };
    }
  }, [chartRef, setDimensions]);

  useLayoutEffect(() => {
    if (
      chartRef !== undefined &&
      dimensions.width > 0 &&
      dimensions.height > 0
    ) {
      console.log("## MOUNT");
      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);
      setSVG?.(svg);

      return () => {
        console.log("## UNMOUNT");
        svg.remove();
      };
    }
  }, [dimensions]);

  return (
    <div
      className={containerClass ?? ""}
      style={{
        height: "100%",
        border: "solid 1px #eee",
        boxSizing: "border-box",
        display: "flex",
        position: "relative",
        alignItems: "stretch",
        flexDirection: "column",
        overflow: "hidden",
        ...containerStyle
      }}
    >
      {title !== undefined && (
        <div
          style={{
            position: "relative",
            fontSize: "1rem",
            color: "#272727",
            boxSizing: "border-box"
            // backgroundColor: "#eee"
          }}
        >
          <p
            style={{
              position: "absolute",
              margin: 5,
              paddingBottom: 2,
              display: "inline-block",
              borderBottom: "solid 1px #000"
            }}
          >
            {props.title}
          </p>
        </div>
      )}
      <div ref={chartRef} style={{ flex: 1, maxHeight: "100%" }}>
        {props.children}
      </div>
    </div>
  );
}
