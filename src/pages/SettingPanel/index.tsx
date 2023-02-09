import React from "react";
import ViewContainer from "../components/ViewContainer";

export default function SettingPanel(props: any): JSX.Element {
  const { containerStyle } = props;
  return (
    <ViewContainer
      title={"Control"}
      containerStyle={containerStyle}
    ></ViewContainer>
  );
}
