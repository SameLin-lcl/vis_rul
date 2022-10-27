import { IProps } from "./types";
import React from "react";

export default function ViewContainer(props: IProps): JSX.Element {
  return (
    <div
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      {props.title}
      {props.children}
    </div>
  );
}
