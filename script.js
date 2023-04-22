const API_KEY = "5694d1137e39485f19522244816125fa";
const cityFormEl = document.querySelector("#city-form");
const cityInputEl = document.querySelector("#city-input");
const searchHistoryEl = document.querySelector("#search-history");
const currentWeatherEl = document.querySelector("#current-weather");
const futureWeatherEl = document.querySelector("#future-weather");

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
cityFormEl.addEventListener("submit", handleFormSubmit);

function displayCurrentWeather(data) {
    const cityName = data.name;
    const date = new Date(data.dt * 1000).toLocaleDateString();
    const icon = data.weather[0].icon;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    currentWeatherEl.innerHTML = 
    `<h2>${cityName} (${date}) <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${data.weather[0].description}" /></h2>
    <p>Temperature: ${temperature} &#8457;</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} MPH</p>`;
}

function displayFutureWeather(data) {
    let html = "";
    for (let i = 0; i < data.list.length; i += 8) {
        const date = new Date(data.list[i].dt * 1000).toLocaleDateString();
        const icon = data.list[i].weather[0].icon;
        const temperature = data.list[i].main.temp;
        const humidity = data.list[i].main.humidity;
        const windSpeed = data.list[i].wind.speed;

        html +=
        `<div class="future-weather-item">
        <h3>${date} <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${data.list[i].weather[0].description}" /></h3>
        <p>Temperature: ${temperature} &#8457;</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} MPH</p>
      </div>`;
    }
    futureWeatherEl.innerHTML = html;
}

function displayWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`;
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        displayCurrentWeather(data);
        const apiForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${API_KEY}`;
        fetch(apiForecastUrl)
        .then(response => response.json())
        .then(data => displayFutureWeather(data))
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
}

function addCityToHistory(city) {
    if (searchHistory.indexOf(city) === -1) {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        const buttonEl = document.createElement("button");
        buttonEl.textContent = city;
        buttonEl.addEventListener("click", function () {
            displayWeather(city);
        });
        searchHistoryEl.appendChild(buttonEl);
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    const city = cityInputEl.value.trim();
    if (city) {
        displayWeather(city);
        addCityToHistory(city);
        cityInputEl.value = "";
    }
}

for (let i = 0; i < searchHistory.length; i++) {
    const buttonEl = document.createElement("button");
    buttonEl.textContent = searchHistory[i];
    buttonEl.addEventListener("click", function () {
      displayWeather(searchHistory[i]);
    });
    searchHistoryEl.appendChild(buttonEl);
  }
  
  const clearHistoryBtn = document.querySelector("#clear-history-btn");
  clearHistoryBtn.addEventListener("click", clearSearchHistory);

  function clearSearchHistory() {
    searchHistory = [];
    localStorage.removeItem("searchHistory");

    while (searchHistoryEl.firstChild) {
        searchHistoryEl.removeChild(searchHistoryEl.firstChild);
    }
  }