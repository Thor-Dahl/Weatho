const API_KEY = 'fbd75a4a77ee167ea4d5ca7db8646232';
const city = 'Manila';

async function getWeather() {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await res.json();

    console.log(data.name);
    console.log(data.main.temp);
    console.log(data.weather[0].description);
}

getWeather();