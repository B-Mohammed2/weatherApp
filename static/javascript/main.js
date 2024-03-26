// Import the luxon library

//state
let city="null";
// Function to get the current location of the user
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Success callback function for getCurrentPosition
function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Use latitude and longitude to fetch city name using reverse geocoding
    getCityName(latitude, longitude);
}

// Error callback function for getCurrentPosition
function errorCallback(error) {
    console.error("Error getting current location:", error);
    // If getting current location fails, fallback to default city (Oslo)
    getWeather(city || "oslo"); // Fetch weather data for either current location or Oslo
}

// Function to fetch city name using reverse geocoding
function getCityName(latitude, longitude) {
    // Use a reverse geocoding API to get the city name based on latitude and longitude
    // This part of the code will depend on the specific reverse geocoding service you use
    // You need to replace 'YOUR_REVERSE_GEOCODING_API_KEY' with your actual API key
    // And adjust the API endpoint and response parsing accordingly
    const apiKey = 'YOUR_REVERSE_GEOCODING_API_KEY';
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const cityName = data.results[0].address_components[2].long_name; // Assuming the city name is in the third address component
                getWeather(cityName); // Fetch weather data for the obtained city
            } else {
                console.error("No city found for the provided latitude and longitude.");
                getWeather(city || "oslo"); // Fetch weather data for either current location or Oslo
            }
        })
        .catch(error => {
            console.error("Error fetching city name:", error);
            getWeather(city || "oslo"); // Fetch weather data for either current location or Oslo
        });
}

// Call getCurrentLocation to get the current location of the user
getCurrentLocation();


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
document.querySelector(".citySearch").addEventListener('submit',e=>{
    let search=document.querySelector(".citySearch input");
    e.preventDefault();
    city=search.value;
    getWeather();
    console.log(search.value);

});

// converting country code
function convertContryCode(country){
    let reagionName=new Intl.DisplayNames(["en"],{type:"region"})
    return reagionName.of(country);
}

// Create a function to map time zone offset to IANA time zone identifier
function mapTimeZoneOffsetToIANA(offsetInSeconds) {
    const offsetHours = offsetInSeconds / 3600;
    const offsetString = offsetHours > 0 ? `+${offsetHours}` : offsetHours.toString();
    return `Etc/GMT${offsetString}`;
}




// update time

function updateDateTime() {
    const dateTimeElement = document.querySelector(".dateTime");
    const now = DateTime.now().setZone(mapTimeZoneOffsetToIANA(currentCityTimezone));
    const formattedDate = now.toFormat('ccc, d MMM yyyy, hh:mm:ss a');
    dateTimeElement.innerHTML = formattedDate;
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

function getWeather() {
    var apiKey = '7a435a3f4f51861142ce2843c4774aaa';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`)
        .then(res => res.json())
        .then(data => {
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
        });
}


document.addEventListener('DOMContentLoaded', getWeather);
