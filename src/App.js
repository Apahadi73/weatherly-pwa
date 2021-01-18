import React, { useState } from "react";
import { fetchWeather } from "./api/fetchWeather";

import "./App.css";

const App = () => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [weather, setWeather] = useState({});

  const search = async (e) => {
    setFirstTimeLoad(false);
    //   checks if user pressed enter key
    if (e.key === "Enter") {
      // fetches weather from backend based on user input
      try {
        const data = await fetchWeather(query);
        setError(null);
        setWeather(data);
        setQuery("");
      } catch (err) {
        setError("Please enter a valid city");
      }
    }
  };

  return (
    <div className="main-container">
      <input
        type="text"
        className="search"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={search}
      />

      {/* Show instruction for the first time when the page loads */}
      {firstTimeLoad && (
        <div className="card">
          <p>
            Please enter the city in the above weather search bar for weather
            info
          </p>
        </div>
      )}
      {/* only run if weather has main property and city name is valid */}
      {weather.main && !error && (
        <div className="city">
          <h2 className="city-name">
            <span>{weather.name}</span>
            <sup>{weather.sys.country}</sup>
          </h2>
          <div className="city-temp">
            {Math.round(weather.main.temp)}
            <sup>&deg;C</sup>
          </div>
          <div className="info">
            <img
              className="city-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p>{weather.weather[0].description}</p>
          </div>
        </div>
      )}
      {/* shows error if user entered invalid city */}
      {error && (
        <div className=" card ">
          <div className="error">
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
