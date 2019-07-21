import React from "react";
import "../util/App.css";

import Weather from "./Weather.js";
import ErrorBoundary from "./ErrorBoundary.js";

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <Weather />
      </div>
    </ErrorBoundary>
  );
}

export default App;
