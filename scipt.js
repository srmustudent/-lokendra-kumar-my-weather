 // API Key and base URL
const API_KEY = "219e6d1471ef449b87c170656252102";
const API_BASE_URL = "http://api.weatherapi.com/v1/current.json";

// DOM Elements
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const errorMessage = document.getElementById("error-message");
const weatherInfo = document.getElementById("weather-info");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weather-icon");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const localTime = document.getElementById("local-time");

// Event Listeners
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    } else {
        displayError("Please enter a city name");
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        displayError("Fetching your location...");
        
        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoords(lat, lon);
            },
            // Error callback
            (error) => {
                handleGeolocationError(error);
            }
        );
    } else {
        displayError("Geolocation is not supported by your browser");
    }
});

// Fetch weather data by city name
function fetchWeatherByCity(city) {
    const url = `${API_BASE_URL}?key=${API_KEY}&q=${city}&aqi=no`;
    
    displayError("Loading weather data...");
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                if (response.status === 400 || response.status === 404) {
                    throw new Error("City not found");
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            if (error.message === "City not found") {
                displayError("City not found. Please check the spelling and try again.");
            } else {
                displayError("Failed to fetch weather data. Please try again later.");
            }
            console.error("Error fetching weather:", error);
        });
}

// Fetch weather data by coordinates
function fetchWeatherByCoords(lat, lon) {
    const url = `${API_BASE_URL}?key=${API_KEY}&q=${lat},${lon}&aqi=no`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            displayError("Failed to fetch weather data for your location. Please try again later.");
            console.error("Error fetching weather:", error);
        });
}

// Display weather data
function displayWeather(data) {
    // Clear any error messages
    errorMessage.textContent = "";
    
    // Update DOM with weather data
    cityName.textContent = `${data.location.name}, ${data.location.country}`;
    temperature.textContent = `Temperature: ${data.current.temp_c}°C / ${data.current.temp_f}°F`;
    condition.textContent = `Condition: ${data.current.condition.text}`;
    weatherIcon.src = data.current.condition.icon;
    humidity.textContent = `Humidity: ${data.current.humidity}%`;
    windSpeed.textContent = `Wind: ${data.current.wind_kph} km/h`;
    localTime.textContent = `Local time: ${data.location.localtime}`;
    
    // Show weather info
    weatherInfo.classList.remove("hidden");
}

// Display error message
function displayError(message) {
    errorMessage.textContent = message;
    weatherInfo.classList.add("hidden");
}

// Handle geolocation errors
function handleGeolocationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            displayError("You denied the request for geolocation. Please enter a city manually.");
            break;
        case error.POSITION_UNAVAILABLE:
            displayError("Location information is unavailable. Please enter a city manually.");
            break;
        case error.TIMEOUT:
            displayError("The request to get your location timed out. Please enter a city manually.");
            break;
        case error.UNKNOWN_ERROR:
            displayError("An unknown error occurred while getting your location. Please enter a city manually.");
            break;
    }
}
