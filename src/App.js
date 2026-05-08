import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/App.css'
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar/Sidebar'
import Overview from './pages/Overview/Overview';
import CurrentWeather from './pages/CurrentWeather/CurrentWeather';
import Forecast from './pages/Forecast/Forecast';
import Map from './pages/Map/Map';
import Settings from './pages/Settings/Settings';
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import FullPageLoader from './components/common/LoadingSpinner/FullPageLoader';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/current-weather" element={<CurrentWeather />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/map" element={<Map />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;