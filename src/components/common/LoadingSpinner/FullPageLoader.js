import React from "react";
import LoadingSpinner from "./LoadingSpinner";

function FullPageLoader() {
  return (
    <div className="loading-spinner-fullpage">
      <LoadingSpinner size="large" message="Loading SkyCast..." />
    </div>
  );
}

export default FullPageLoader;
