import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const WithLoading = ({
  isLoading,
  children,
  size = "medium",
  message = "Loading...",
}) => {
  if (isLoading) {
    return <LoadingSpinner size={size} message={message} />;
  }
  return <>{children}</>;
};

export default WithLoading;
