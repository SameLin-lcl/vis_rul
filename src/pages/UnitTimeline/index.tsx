import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ViewContainer from "../components/ViewContainer";
import { mockScatterData } from "../Scatter/mock";
import * as d3 from "d3";
import { FEATURE_DATA } from "../Feature Analysis/mock";

export default function UnitTimeline(props: any): JSX.Element {
  const { containerStyle } = props;

  const chartRef: any = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [svg, setSVG] = useState(d3.create("svg"));
  const data = FEATURE_DATA;

  useLayoutEffect(() => {
    if (svg !== null && dimensions.width !== 0) {
      draw(data);
      return () => {
        svg.selectAll("*").remove();
      };
    }
  }, [svg, data, dimensions]);

  const draw = (data: any[]): void => {
    //
  };

  return (
    <ViewContainer
      title={"Unit Timeline"}
      containerStyle={containerStyle}
    ></ViewContainer>
  );
}
