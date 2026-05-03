function capitalizeFL(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getWeatherIconURL(icon) {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

async function getWeather() {
    const city = $('#city-input').val().trim();

    setState('loading');
    try {
        // get weather data
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await res.json();

        // handle wrong search
        if (res.ok === false) {
            setState('error');
            return;
        }
        setState('success');

        //build weather card
        const weatherIcon = getWeatherIconURL(data.weather[0].icon);
        const weatherCard = `
            <div class="weather-card">
                <button class="remove-btn">✕</button>
                <div class="temperature">
                    <img src="${weatherIcon}" id="weather-icon"/>
                    <p id="temperature-value">${Math.round(data.main.temp)}°C</p>
                </div>
                <div class="city">
                    <p id="city-name">${data.name}</p>
                    <p id="country-name">feels like ${Math.round(data.main.feels_like)}°C</p>
                </div>
                <div class="other-info">
                    <p id="description">${capitalizeFL(data.weather[0].description)}</p>
                    <p id="humidity">${data.main.humidity}%</p>
                    <p id="humidity">${data.wind.speed} km/h</p>
                </div>
            </div>
        `;
        //remove card
        const $card = $(weatherCard);
        $card.find('.remove-btn').on('click', function() {
            $card.remove()
        });

        $('.weather-card-container').append($card);
    } catch {
        setState('error');;
    }
    
}

async function getSuggestions() {
    const city = $('#city-input').val().trim();

    if (!city) {
        $('.suggestions-container').empty().hide();
        return;
    }

    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`)
    const data = await res.json();

    $('.suggestions-container').empty();

    if (data.length === 0) {
        $('.suggestions-container').hide();
        return;
    }

    $('.suggestions-container').css('display', 'flex');

    data.forEach(function(sug) {
        const city = sug.name;
        const country = sug.country;

        const item = `
            <div class="suggestion">
                <p class="suggestion-city-name">${city}</p>
                <p class="suggestion-country-name">${country}</p>
            </div>
        `
        const $item = $(item);

        $item.on('click', function() {
            $('#city-input').val(city);
            getWeather();
            $('.suggestions-container').empty().hide();
            $('#city-input').val('');
        })

        $('.suggestions-container').append($item);
    }) 
}

function setState(state) {
    switch(state) {
        case 'idle': break;
        case 'loading': 
            const loadingItem = `
                <div class="loading weather-card" id="loading-card">
                    <p class="loading-icon">...</p>
                </div>
            `;
            $('#loading-card').remove();
            $('.weather-card-container').append(loadingItem)
            break;
        case 'success': 
            $('#loading-card').remove();
            break;
        case 'error': 
            const errorItem = `
                <div class="error weather-card" id="error-card">
                    <p class="error-text">Something went wrong...</p>
                </div>
            `;
            $('#loading-card').remove();
            $('.weather-card-container').append(errorItem)
            break;
    }
}

$('#get-weather-btn').on('click', getWeather);    // get weather when button is clicked
$('#city-input').on('keyup', getSuggestions)    // suggestions popup when typing