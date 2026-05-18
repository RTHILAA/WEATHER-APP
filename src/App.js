import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import { ThemeProvider } from "./context/ThemeContext";
import { LocationProvider } from "./context/LocationContext";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import Overview from "./pages/Overview/Overview";
import CurrentWeather from "./pages/CurrentWeather/CurrentWeather";
import Forecast from "./pages/Forecast/Forecast";
import Map from "./pages/Map/Map";
import Settings from "./pages/Settings/Settings";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <BrowserRouter>
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<CurrentWeather />} />
                <Route path="/current-weather" element={<CurrentWeather />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/forecast" element={<Forecast />} />
                <Route path="/map" element={<Map />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </LocationProvider>
    </ThemeProvider>
  );
}

export default App;
