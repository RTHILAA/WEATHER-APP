import React from 'react';
import "./Sidebar.css";
import LOGO from "../../../assets/images/logo.png";
import { LayoutDashboard, Sun, CalendarDays, Map, Settings, MapPin, PanelLeftClose } from "lucide-react";

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-content">
                <div className="sidebar-top">
                    <div className="sidebar-content-header">
                        <img src={LOGO} className="sidebar-logo-img" alt="Logo" />
                        <span className="sidebar-title">SkyCast</span>
                    </div>
                    <ul>
                        <li><a href="/"><LayoutDashboard size={18} />Overview</a></li>
                        <li><a href="/current-weather"><Sun size={18} />Current Weather</a></li>
                        <li><a href="/forecast"><CalendarDays size={18} />Forecast</a></li>
                        <li><a href="/map"><Map size={18} />Map</a></li>
                        <li><a href="/settings"><Settings size={18} />Settings</a></li>
                    </ul>
                </div>
                <div className="sidebar-bottom">
                    <div className='current-location'>
                        <div className="location-icon">
                            <MapPin size={18} color='#F97316' />
                        </div>
                        <div className="location-text">
                            <span className="location-city">New York, US</span>
                            <span className="location-label">Current location</span>
                        </div>
                    </div>
                    <span className='collapse'><PanelLeftClose size={18} />Collapse</span>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;