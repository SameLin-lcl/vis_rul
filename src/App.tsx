import React from "react";
import Performance from "./pages/Performance";
import SettingPanel from "./pages/SettingPanel";
import ScatterView from "./pages/Scatter";
import UnitTimeline from "./pages/UnitTimeline";
import FeatureView from "./pages/FeatureAnalysis";
import { globalData } from "./mobx/store/globalData";

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
        <SettingPanel
          containerStyle={{ width: "15vw", height: "35vh" }}
          globalData={globalData}
        />
        <Performance
          containerStyle={{ width: "15vw", height: "65vh" }}
          globalData={globalData}
        />
      </div>
      <div
        style={{
          flex: 4,
          display: "flex",
          gap: 5,
          flexDirection: "column"
        }}
      >
        <ScatterView
          containerStyle={{ width: "40vw", height: "50vh" }}
          globalData={globalData}
        />
        <FeatureView
          containerStyle={{ width: "40vw", height: "50vh" }}
          globalData={globalData}
        />
      </div>
      <div
        style={{
          flex: 4,
          display: "flex",
          gap: 5,
          flexDirection: "column"
        }}
      >
        <UnitTimeline
          containerStyle={{ width: "45vw", height: "100vh" }}
          globalData={globalData}
        />
      </div>
      <div
        id={"tooltip"}
        style={{
          position: "absolute",
          padding: 5,
          borderRadius: 5,
          background: "#444",
          color: "#fff",
          zIndex: 10,
          visibility: "hidden",
          top: -1000,
          left: -1000,
          fontSize: 12
        }}
      />
    </div>
  );
}

export default App;
