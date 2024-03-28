

//state
let city="null";

// temperature

let units="metric";
let currentCityTimezone = null;

// Add event listener for unit change - Celsius
document.querySelector(".unitCelsius").addEventListener('click', function() {
    // Check if the current units are not already metric
    if (units !== "metric") {
        // Change units to metric
        units = "metric";
        // Call getWeather function to fetch weather data with new units
        getWeather();
      
    }
});

// Add event listener for unit change - Fahrenheit
document.querySelector(".unitFarenheit").addEventListener('click', function() {
    // Check if the current units are not already imperial
    if (units !== "imperial") {
        // Change units to imperial
        units = "imperial";
        // Call getWeather function to fetch weather data with new units
        getWeather();
       
    }
});


// Define a mapping between weather conditions and icon filenames
const weatherImg = {
    "Clear": "clear.png",
    "Clouds": "clouds.png",
    "Rain": "rain.png",
    "Snow": "snow.png",
    "Storm": "storm.png",
    "Wind": "wind.png",
    "Fog": "fog.png",
    "Mist": "mist.png",
};

//selectors
let weatherCity = document.querySelector(".weatherCity");
let dateTime = document.querySelector(".dateTime"); 
let weatherForcast=document.querySelector(".weather");
let weathTemp = document.querySelector(".weatherTemp");
let weatherIcon = document.querySelector(".weatherIcon");
let weatherMinMax=document.querySelector(".weatherMinMax");
let feelsLike=document.querySelector(".feelsLike");
let humidity=document.querySelector(".humidity");
let wind=document.querySelector(".wind");
let pressure=document.querySelector(".pressure");


//search city
document.querySelector(".citySearch").addEventListener('submit', e => {
    e.preventDefault();
    let search = document.querySelector(".citySearch input").value;
    city = search; // Update the global city variable
    getWeather(city); // Pass the city value to getWeather function
});

// converting country code
function convertContryCode(country){
    let reagionName=new Intl.DisplayNames(["en"],{type:"region"})
    return reagionName.of(country);
}

// Create a function to map time zone offset to IANA time zone identifier
function mapTimeZoneOffsetToIANA(offsetInSeconds) {
    const offsetHours = offsetInSeconds / 3600;
    // const offsetString = offsetHours > 0 ? `-${offsetHours}` : offsetHours.toString();
    const offsetString = offsetHours !== 0 ? (offsetHours > 0 ? `-${offsetHours}` : `+${Math.abs(offsetHours)}`) : '0';

    return `Etc/GMT${offsetString}`;
}


// update time

function updateDateTime() {
    const dateTimeElement = document.querySelector(".dateTime");
    const now = luxon.DateTime.now().setZone(mapTimeZoneOffsetToIANA(currentCityTimezone));
    const formattedDate = now.toFormat('ccc, d MMM yyyy, hh:mm:ss a');
    dateTimeElement.innerHTML = formattedDate;
    console.log('currentCityTimezone' + currentCityTimezone);
}



// Call updateDateTime every second (1000 milliseconds)
setInterval(updateDateTime, 1000);

// convrting time and zone
function convertTimeStamp(timestamp, timezoneOffset) {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    const options = {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        hour12: true,
    };
    console.log(date.toLocaleString([], options));
    // return date.toLocaleString("en-US", options);
    return date.toLocaleString([], options);
}

function getWeather(city = null) {
    var apiKey = '7a435a3f4f51861142ce2843c4774aaa';
    var units = 'metric';

    if (city) {
        // Fetch weather data by city
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`)
            .then(res => res.json())
            .then(data => {
                displayWeatherData(data);
            })
            .catch(error => {
                console.error('Error fetching weather data by city:', error);
            });
    } else {
        // Get user's location
        navigator.geolocation.getCurrentPosition(position => {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            
            // Fetch weather data based on user's location
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`)
                .then(res => res.json())
                .then(data => {
                    displayWeatherData(data);
                })
                .catch(error => {
                    console.error('Error fetching weather data by location:', error);
                });
        });
    }
}

function displayWeatherData(data) {

    if (!data || !data.name || !data.sys || !data.sys.country || !data.main || !data.weather || !data.weather[0]) {
        console.error('Invalid weather data:', data);
        return;
    }

    currentCityTimezone = data.timezone;
    console.log(data.timezone);
    weatherCity.innerHTML = `${data.name},${convertContryCode(data.sys.country)}`;
    dateTime.innerHTML = convertTimeStamp(data.dt, data.timezone);
    weatherForcast.innerHTML = `<p>${data.weather[0].main}</p>`;
    weathTemp.innerHTML = `${Math.round(data.main.temp)}&#176${units === "metric" ? "C" : "F"}`;
    // creating variables to find the image acordind to weather forcast.
    let weatherCondition = data.weather[0].main;
    if (weatherImg.hasOwnProperty(weatherCondition)) {
        let iconFilename = weatherImg[weatherCondition];
        weatherIcon.src = `static/img/icons/${iconFilename}`;
    } else {
        weatherIcon.src = `/static/img/icons/clear.png`;
    }
    weatherIcon.innerHTML= `<img src=${weatherIcon.src} alt="weatherIcon">`;

    weatherMinMax.innerHTML=`<p>Min:${Math.round(data.main.temp_min)}&#176</p>
    <p>Max:${Math.round(data.main.temp_max)}&#176</p>`;
    feelsLike.innerHTML=`${Math.round(data.main.feels_like)}&#176${units === "metric" ? "C" : "F"}`;
    humidity.innerHTML=`${Math.round(data.main.humidity)}%`;
    wind.innerHTML=`${data.wind.speed} M/S`;
    pressure.innerHTML=`${Math.round(data.main.pressure)} hpa`;

    console.log(data);
}

document.addEventListener('DOMContentLoaded', () => {
    // Fetch weather data by city name

    // Fetch weather data based on user's geolocation
    getWeather();
});


