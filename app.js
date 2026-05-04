class weatherCard {
    constructor(data) {
        this.temp = data.main.temp;
        this.name = data.name;
        this.humidity = data.main.humidity;
        this.windSpeed = data.wind.speed;
        this.feelsLike = data.main.feels_like;
        this.description = capitalizeFL(data.weather[0].description);
        this.weatherIcon = getWeatherIconURL(data.weather[0].icon);
        this.$el = $(`
            <div class="weather-card">
                <button class="remove-btn">✕</button>
                <div class="temperature">
                    <img src="${this.weatherIcon}" id="weather-icon"/>
                    <p id="temperature-value">${Math.round(this.temp)}°C</p>
                </div>
                <div class="city">
                    <p id="city-name">${this.name}</p>
                    <p id="country-name">feels like ${Math.round(this.feelsLike)}°C</p>
                </div>
                <div class="other-info">
                    <p id="description">${this.description}</p>
                    <p id="humidity">${this.humidity}%</p>
                    <p id="humidity">${this.windSpeed} km/h</p>
                </div>
            </div>
        `);
        }
    detColor() {
        if (this.temp > 30) {
                this.$el.css('border-color', 'orange');
        } 
        else if (this.temp > 20) {
            this.$el.css('border-color', 'yellow');
        }
        else if (this.temp > 10) {
            this.$el.css('border-color', 'green');
        }
        else if (this.temp > 0) {
            this.$el.css('border-color', 'blue');
        }
        else {
            this.$el.css('border-color', 'white');
        }
    }   
}

//HELPER: capitalizes the first letter of a string
function capitalizeFL(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
//HELPER: returns the link version of a weather icon
function getWeatherIconURL(icon) {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
//gets the weather data and displays data as a card
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
        const card = new weatherCard(data);
        card.detColor();
        //remove card
        card.$el.find('.remove-btn').on('click', function() {
            card.$el.remove()
        });
        //append card
        $('.weather-card-container').append(card.$el);
    } catch {
        setState('error');;
    }
}
//gets the city suggestions based on typed text and city population and displays five search suggestions
async function getSuggestions() {
    const city = $('#city-input').val().trim();
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=en&format=json`)
    const data = await res.json();
    const results = data.results || [];

    // hide container when no suggestions
    if (!city) {
        $('.suggestions-container').empty().hide();
        return;
    }
    if (results.length === 0) {
        $('.suggestions-container').hide();
        return;
    }
    $('.suggestions-container').css('display', 'flex');
    $('.suggestions-container').empty();

    //remove duplicate city in data array
    const seenCities = new Set();
    const uniqueCities = results.filter(city => {
        if (seenCities.has(city.name)) return false;
        seenCities.add(city.name); return true;
    });

    //create suggestion cards
    uniqueCities.forEach(function(sug) {
        const city = sug.name;
        const country = sug.country_code;

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

//implement 4 ui states for search
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