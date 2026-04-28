async function getWeather() {
    const city = $('#city-input').val().trim();

    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await res.json();

    const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const weatherCard = `
        <div class="weather-card">
            <div class="temperature">
                <img src="${weatherIcon}" id="weather-icon"/>
                <p id="temperature-value">${Math.round(data.main.temp)}°C</p>
            </div>
            <div class="city">
                <p id="city-name">${data.name}</p>
                <p id="country-name">feels like ${Math.round(data.main.feels_like)}°C</p>
            </div>
            <div class="other-info">
                <p id="description">${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}</p>
                <p id="humidity">${data.main.humidity}%</p>
                <p id="humidity">${data.wind.speed} km/h</p>
            </div>
        </div>
    `;

    $('.weather-card-container').append(weatherCard);
}

$('#get-weather-btn').on('click', function() {
    getWeather();
});

/*
 ~ 1.) fix alignment of values
 ~ 2.) implement a header identifying column values
 ~ 3.) implement feels like
 ~ 4.) implement quick emoji based on WMO weathercode
 ~ 5.) implement wind speed
 6.) implement remove card
 7.) handle wrong searches
 8.) handle all four UI states
 9.) implement enter for button submit
*/