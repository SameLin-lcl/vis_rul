import React from "react";
import "./App.css";
import SettingPanel from "./pages/OverView";

function App(): JSX.Element {
  return (
    <div className="App">
      <div className="app-left" style={{ width: "20vw" }}>
        <SettingPanel />
      </div>
      <div className="app-center" style={{ width: "50vw" }}></div>
      <div className="app-right" style={{ width: "30vw" }}></div>
    </div>
  );
}

export default App;
