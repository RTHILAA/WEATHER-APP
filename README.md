<div align="center">

<img src="https://img.shields.io/badge/SkyCast-v1.0.0-f97316?style=for-the-badge&logo=cloud&logoColor=white"/>
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/OpenWeatherMap-API-EB6E4B?style=for-the-badge&logo=openweathermap&logoColor=white"/>
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge"/>

<br/><br/>

# ☁️ SkyCast

### Real-time Weather Forecasting — Beautiful, Fast, and Responsive

*A modern React weather app with live data, interactive maps, and full customization.*

<br/>

[🚀 Live Demo](#) · [📖 Docs](#) · [🐛 Report Bug](https://github.com/yourusername/skycast/issues) · [✨ Request Feature](https://github.com/yourusername/skycast/issues)

---

</div>

## 📸 Preview

<div align="center">

> *Screenshot placeholder — replace with actual app screenshot*

</div>

---

## ✨ Features

### 🌤️ Current Weather
- Real-time temperature, feels-like, humidity, wind speed, and pressure
- Dynamic weather icons based on conditions
- UV index with safety recommendations
- Sunrise & sunset times
- Cloud cover, precipitation chance, and dew point

### 📅 5-Day Forecast
- Daily highs and lows with condition descriptions
- Hourly forecast at 3-hour intervals
- Temperature trend visualization
- Special styling for "Today" and "Now" cards
- Gradient cards with smooth hover effects

### 🗺️ Interactive Weather Map
- Powered by **Leaflet.js**
- Multiple layers: Temperature, Precipitation, Wind Speed, Cloud Cover
- Dynamic color-coded visualization
- Current location marker with weather popup
- Dark mode support & layer legend

### 📊 Dashboard Overview
- At-a-glance weather summary
- Sunrise/Sunset timeline
- 5-day forecast with temperature bars
- Today's highlights: UV Index, Air Quality, Dew Point
- Dynamic background icons based on weather

### 🔍 Location Management
- Worldwide city search via OpenWeather Geocoding API
- Smart search with autocomplete
- GPS-based current location detection
- Persistent location storage
- Mobile-friendly search modal

### ⚙️ Settings & Customization
- 🌡️ Temperature units: Celsius / Fahrenheit
- 🌙 Theme: Light / Dark (persistent)
- 📏 Measurement: Metric / Imperial
- 🌍 Language preferences (multi-language ready)
- 🔔 Notification controls
- ⏱️ Auto-refresh intervals: 15min, 30min, 1hr, 2hr

### 📱 Responsive Design
- Desktop: collapsible sidebar layout
- Tablet (481px–949px): collapsed sidebar
- Mobile (≤480px): touch-friendly interface
- Smooth transitions & animations across all modern browsers

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Frontend** | React 19, React Router DOM 7 |
| **Styling** | CSS3, CSS Modules, Responsive Design |
| **Icons** | Lucide React |
| **Maps** | Leaflet, React-Leaflet |
| **API** | OpenWeatherMap (Current, Forecast, Geocoding, UV Index) |
| **State** | React Context API |
| **Build** | Create React App (react-scripts) |
| **PWA** | Web App Manifest |

---

## 📋 Prerequisites

- **Node.js** v14 or higher
- **npm** or **yarn**
- An **OpenWeatherMap API key** — [Get one here](https://openweathermap.org/api)

---

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/skycast.git
cd skycast
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:
```env
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
```

### 4. Start the development server
```bash
npm start
# or
yarn start
```

### 5. Build for production
```bash
npm run build
# or
yarn build
```

---

## 📁 Project Structure

```
skycast/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── assets/images/
│   │   └── logo.png
│   ├── components/
│   │   ├── common/
│   │   │   ├── LoadingSpinner/
│   │   │   └── Notification/
│   │   └── layout/
│   │       └── Sidebar/
│   ├── context/
│   │   ├── LocationContext.js
│   │   └── ThemeContext.js
│   ├── hooks/
│   │   └── useWeather.js
│   ├── pages/
│   │   ├── Overview/
│   │   ├── CurrentWeather/
│   │   ├── Forecast/
│   │   ├── Map/
│   │   ├── Settings/
│   │   └── PageNotFound/
│   ├── services/
│   │   └── weatherService.js
│   ├── styles/
│   │   └── App.css
│   ├── utils/
│   │   └── resizeObserverFix.js
│   ├── App.js
│   └── index.js
├── .env
├── package.json
└── README.md
```

---

## 🔧 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Runs the app in development mode |
| `npm run build` | Builds the app for production |
| `npm test` | Launches the test runner |
| `npm eject` | Ejects from Create React App |

---

## 🌐 API Reference

SkyCast uses the [OpenWeatherMap API](https://openweathermap.org/api):

| Endpoint | Purpose |
|---|---|
| `weather` | Current weather data |
| `forecast` | 5-day forecast (3-hour intervals) |
| `geo/1.0/direct` | City search / geocoding |
| `geo/1.0/reverse` | Reverse geocoding (coordinates → city) |
| `uvi` | UV index data |
| `air_pollution` | Air quality data (optional) |

---

## 🎨 Design System

### Color Palette
| Role | Value |
|---|---|
| Primary | `#f97316` — Orange (Brand) |
| Gradient | `#f97316` → `#ea580c` → `#c2410c` |
| Dark Background | `#0f172a` (Slate 900) |
| Light Background | `#f8fafc` (Slate 50) |
| Text (Dark) | `#f1f5f9` (Slate 100) |
| Text (Light) | `#1e293b` (Slate 800) |

### Typography
- **Font Family:** Montserrat (Google Fonts)
- **Weights:** 400, 500, 600, 700

### Icons
- All icons from **Lucide React**
- Dynamic weather icons based on OpenWeatherMap conditions

---

## 🧪 Browser Support

| Browser | Version |
|---|---|
| Chrome | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |
| Edge | ✅ Latest |
| Opera | ✅ Latest |

---

## 🔒 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `REACT_APP_OPENWEATHER_API_KEY` | Your OpenWeatherMap API key | ✅ Yes |

---

## 📱 PWA Support

SkyCast includes full PWA support:
- ✅ Web App Manifest configured
- ✅ Basic offline caching
- ✅ Installable on mobile devices
- ✅ Theme color `#0f172a`

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

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

[![Instagram](https://img.shields.io/badge/Instagram-@a.elharazi-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/a.elharazi)
[![GitHub](https://img.shields.io/badge/GitHub-yourusername-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)

</div>

---

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) — Weather data API
- [Leaflet](https://leafletjs.com/) — Interactive mapping library
- [Lucide](https://lucide.dev/) — Beautiful open-source icons
- [Google Fonts](https://fonts.google.com/) — Montserrat typeface

---

## 📧 Contact

For support or inquiries: **support@skycast.com**

---

<div align="center">

⭐ **If you found this project helpful, please give it a star on GitHub!** ⭐

<br/>

*Made with ❤️ and ☀️ by Anass El Harazi*

</div>