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
