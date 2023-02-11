import React from "react";
import Performance from "./pages/Performance";
import SettingPanel from "./pages/SettingPanel";
import ScatterView from "./pages/Scatter";
import UnitTimeline from "./pages/UnitTimeline";
import FeatureView from "./pages/FeatureAnalysis";

function App(): JSX.Element {
  return (
    <div
      id={"app"}
      style={{
        display: "flex",
        fontSize: 16,
        height: "100vh",
        overflow: "hidden",
        gap: 5
      }}
    >
      <div
        style={{
          flex: 2,
          display: "flex",
          gap: 5,
          flexDirection: "column"
        }}
      >
        <SettingPanel containerStyle={{ width: "20vw", height: "50vh" }} />
        <Performance containerStyle={{ width: "20vw", height: "50vh" }} />
      </div>
      <div
        style={{
          flex: 4,
          display: "flex",
          gap: 5,
          flexDirection: "column"
        }}
      >
        <ScatterView containerStyle={{ width: "40vw", height: "50vh" }} />
        <FeatureView containerStyle={{ width: "40vw", height: "50vh" }} />
      </div>
      <div
        style={{
          flex: 4,
          display: "flex",
          gap: 5,
          flexDirection: "column"
        }}
      >
        <UnitTimeline containerStyle={{ width: "40vw", height: "100vh" }} />
      </div>
    </div>
  );
}

export default App;
