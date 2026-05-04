import React from "react";
import "./Map.css";
import { Map as MapIcon } from "lucide-react";

function Map() {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-title">
          <MapIcon size={18} />
          Weather Map
        </span>
      </div>
      <div className="map-content">
        {/* Your main content goes here */}
        <p>Interactive weather map will be displayed here.</p>
      </div>
    </div>
  );
}

export default Map;