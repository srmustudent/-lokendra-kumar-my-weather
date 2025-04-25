async function getWeatherData(city) {
    const apiKey = '219e6d1471ef449b87c170656252102';
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Check if the API returned an error object
        if (data.error) {
            // Handle specific error codes
            if (data.error.code === 1006) {
                displayError(`City not found: ${city}. Please check the spelling and try again.`);
            } else {
                displayError(`Error: ${data.error.message}`);
            }
            return null;
        }
        
        // If no error, process the weather data
        return data;
    } catch (error) {
        // Handle network or other exceptions
        displayError(`Failed to fetch weather data: ${error.message}`);
        console.error('Weather API error:', error);
        return null;
    }
}

function displayError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Hide the weather data container
    document.getElementById('weather-container').style.display = 'none';
}
