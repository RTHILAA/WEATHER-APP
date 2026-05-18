<div align="center">

<img src="https://img.shields.io/badge/SkyCast-v1.0.0-f97316?style=for-the-badge&logo=cloud&logoColor=white"/>
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/OpenWeatherMap-API-EB6E4B?style=for-the-badge&logo=openweathermap&logoColor=white"/>
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge"/>

<br/><br/>

# ☁️ SkyCast

**Real-time Weather Forecast**

*A modern, feature-rich weather application built with React — delivering real-time data, interactive maps, and detailed forecasts.*

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20App-4A90D9?style=for-the-badge)](https://anass-elharazi.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![OpenWeatherMap](https://img.shields.io/badge/API-OpenWeatherMap-orange?style=for-the-badge)](https://openweathermap.org)

</div>

---

## 📸 Preview

<div align="center">

> *Replace with actual app screenshot*

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌡️ **Real-time Weather Data** | Current conditions: temperature, humidity, wind speed, and more |
| 📅 **5-Day Forecast** | Daily and hourly weather predictions |
| 🗺️ **Interactive Weather Map** | Visualize temperature, precipitation, wind & cloud cover via Leaflet |
| 🔍 **Location Search** | Search any city worldwide with autocomplete |
| 📍 **Device Location** | Auto-detect and use your current location |
| 🌗 **Dark / Light Mode** | Toggle between themes seamlessly |
| 🌡️ **Temperature Units** | Switch between °C and °F |
| 🔄 **Auto-Refresh** | Configurable automatic data updates |
| 📱 **Responsive Design** | Optimized for desktop, tablet, and mobile |

---

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** v14 or higher
- **npm** or **yarn** package manager
- An **OpenWeatherMap API key** — [Get one free here](https://openweathermap.org/api)

---

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/anass-elharazi/skycast.git
cd skycast
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure your API key

Create a `.env` file in the root directory:
```env
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
```

> 💡 Get your free API key at [openweathermap.org](https://openweathermap.org/api)

### 4. Start the development server
```bash
npm start
```

The app will open at **http://localhost:3000**

### 5. Build for production
```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

---

## 🗂️ Project Structure

```
skycast/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
└── src/
    ├── assets/              # Images and static assets
    ├── components/
    │   ├── common/          # LoadingSpinner, Notification
    │   └── layout/          # Sidebar and layout components
    ├── context/
    │   ├── ThemeContext.js
    │   └── LocationContext.js
    ├── hooks/
    │   └── useWeather.js
    ├── pages/
    │   ├── Overview/
    │   ├── CurrentWeather/
    │   ├── Forecast/
    │   ├── Map/
    │   ├── Settings/
    │   └── PageNotFound/
    ├── services/
    │   └── weatherService.js
    ├── styles/
    │   └── App.css
    ├── utils/
    │   └── resizeObserverFix.js
    ├── App.js
    └── index.js
```

---

## 🧩 Key Components

| Component | Description |
|---|---|
| `CurrentWeather` | Displays current conditions with animated icons |
| `Overview` | Dashboard with key metrics and 5-day timeline |
| `Forecast` | Daily and hourly prediction views |
| `Map` | Interactive Leaflet map with weather layers |
| `Settings` | User preferences and app configuration |
| `Sidebar` | Navigation menu with location search |

---

## 🔌 API Integration

Built on the **OpenWeatherMap** API suite:

| Endpoint | Purpose |
|---|---|
| `weather` | Real-time current conditions |
| `forecast` | 5-day forecast (3-hour intervals) |
| `geo/1.0/direct` | City search & geocoding |
| `geo/1.0/reverse` | Reverse geocoding (coordinates → city) |
| `uvi` | UV radiation levels |
| `air_pollution` | Air quality index |

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Frontend** | React 19, React Router DOM 7 |
| **Styling** | CSS3, CSS Modules, Responsive Design |
| **Icons** | Lucide React |
| **Maps** | Leaflet, React-Leaflet |
| **API** | OpenWeatherMap |
| **State** | React Context API |
| **Build** | Create React App |
| **PWA** | Web App Manifest |

---

## 🔧 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Runs the app in development mode |
| `npm run build` | Builds the app for production |
| `npm test` | Launches the test runner |
| `npm run eject` | Ejects from Create React App |

---

## 📱 Responsive Breakpoints

| Device | Breakpoint | Behavior |
|---|---|---|
| 📱 Mobile | ≤ 480px | Collapsed sidebar, simplified UI |
| 💻 Tablet | 481px – 949px | Semi-collapsed sidebar, adjusted layout |
| 🖥️ Desktop | ≥ 950px | Full sidebar, expanded layout |

---

## 🎨 Design System

### Color Palette

| Role | Value |
|---|---|
| Primary | `#f97316` — Orange (Brand) |
| Gradient | `#f97316` → `#ea580c` → `#c2410c` |
| Dark Background | `#0f172a` (Slate 900) |
| Light Background | `#f8fafc` (Slate 50) |
| Text (Dark mode) | `#f1f5f9` (Slate 100) |
| Text (Light mode) | `#1e293b` (Slate 800) |

### Typography
- **Font:** Montserrat (Google Fonts)
- **Weights:** 400, 500, 600, 700
- **Icons:** Lucide React — dynamic weather icons based on conditions

---

## 🌐 Browser Support

| Browser | Support |
|---|---|
| ![Chrome](https://img.shields.io/badge/-Chrome-4285F4?logo=googlechrome&logoColor=white) | ✅ Latest |
| ![Firefox](https://img.shields.io/badge/-Firefox-FF7139?logo=firefox&logoColor=white) | ✅ Latest |
| ![Safari](https://img.shields.io/badge/-Safari-000000?logo=safari&logoColor=white) | ✅ Latest |
| ![Edge](https://img.shields.io/badge/-Edge-0078D7?logo=microsoftedge&logoColor=white) | ✅ Latest |

---

## 🔒 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `REACT_APP_OPENWEATHER_API_KEY` | Your OpenWeatherMap API key | ✅ Yes |

---

## 📦 PWA Support

SkyCast includes full Progressive Web App support:

- ✅ Web App Manifest configured
- ✅ Basic offline caching
- ✅ Installable on mobile devices
- ✅ Theme color `#0f172a`

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

<div align="center">

**Anass El Harazi**

[![Portfolio](https://img.shields.io/badge/🌐%20Portfolio-anass--elharazi.vercel.app-4A90D9?style=for-the-badge)](https://anass-elharazi.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-@anass--elharazi-181717?style=for-the-badge&logo=github)](https://github.com/anass-elharazi)
[![Instagram](https://img.shields.io/badge/Instagram-@a.elharazi-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/a.elharazi)

</div>

---

## 🙏 Acknowledgments

- Weather data by [OpenWeatherMap](https://openweathermap.org)
- Maps powered by [Leaflet](https://leafletjs.com) & [OpenStreetMap](https://www.openstreetmap.org)
- Icons by [Lucide](https://lucide.dev)
- Typography by [Google Fonts](https://fonts.google.com) — Montserrat

---

<div align="center">

⭐ **If you found this project helpful, please give it a star on GitHub!** ⭐

<br/>

*Made with ❤️ and ☀️ by Anass El Harazi*

</div>