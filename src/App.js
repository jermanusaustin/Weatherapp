import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import { Atom } from 'react-loading-indicators'; 

function Weatherapp() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });

  const toDateFunction = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const WeekDays = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setInput('');
      setWeather({ ...weather, loading: true });

      // OpenWeather API Endpoint with your API key
      const apiKey = 'e754369601dcc3ba9ba7f1fd4bfe8184'; // Replace with your actual API key
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${apiKey}&units=metric`;

      try {
        const weatherResponse = await axios.get(weatherUrl);
        setWeather({ data: weatherResponse.data, loading: false, error: false });
      } catch (error) {
        setWeather({ ...weather, data: {}, error: true });
      }
    }
  };

  return (
    <div className="App">
      <h1 className="app-name">WeatherApp</h1>
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Enter City Name.."
          name="query"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search}
        />
      </div>

      {weather.loading && (
        <>
          <br />
          <br />
          <Atom color="#ffffff" size="medium" text="" textColor="" />
        </>
      )}

      {weather.error && (
        <>
          <br />
          <br />
          <span className="error-message">
            <FontAwesomeIcon icon={faFrown} />
            <span style={{ fontSize: '20px' }}>City not found</span>
          </span>
        </>
      )}

      {weather && weather.data && weather.data.main && (
        <div className="weather-card">
          <div className="city-name">
            <h2>
              {weather.data.name}, <span>{weather.data.sys.country}</span>
            </h2>
          </div>
          <div className="date">
            <span>{toDateFunction()}</span>
          </div>
          <div className="icon-temp">
            <img
              src={`http://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
              alt={weather.data.weather[0].description}
            />
            {Math.round(weather.data.main.temp)}
            <sup className="deg">°C</sup>
          </div>
          <div className="des-wind">
            <p>{weather.data.weather[0].description.toUpperCase()}</p>
            <p>Wind Speed: {weather.data.wind.speed.toFixed(1)} m/s</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Weatherapp;
