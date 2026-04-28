async function getWeather() {
    const city = $('#city-input').val().trim();

    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await res.json();

    console.log(data.name);
    console.log(data.main.temp);
    console.log(data.weather[0].description);

    const weatherCard = `
        <div class="weather-card">
            <p id="city-name">${data.name}</p>
            <p id="temperature">${data.main.temp}</p>
            <p id="description">${data.weather[0].description}</p>
            <p id="humidity">${data.main.humidity}%</p>
        </div>
    `;

    $('.weather-card-container').append(weatherCard);
}

$('#get-weather-btn').on('click', function() {
    getWeather();
});

/*
 1.) fix alignment of values
 2.) implement a header identifying column values
 3.) implement feels like
 4.) implement quick emoji based on WMO weathercode
 5.) implement wind speed
 6.) implement remove card
 7.) handle wrong searches
 8.) handle all four UI states
 9.) implement enter for button submit
*/