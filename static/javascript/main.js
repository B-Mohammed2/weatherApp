//state
let city="oslo";
let units="metric";


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

// }
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
        timeZone: 'UTC',
        hour12: true,
    };
    return date.toLocaleString("en-US", options);
}

// update time
function updateDateTime() {
    const dateTimeElement = document.querySelector(".dateTime");
    const now = new Date();
    const options = {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: 'UTC',
        hour12: true,
    };
    dateTimeElement.innerHTML = now.toLocaleString("en-US", options);
}

// Call updateDateTime every second (1000 milliseconds)
setInterval(updateDateTime, 1000);


function getWeather() {
    const apiKey = '7a435a3f4f51861142ce2843c4774aaa';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`)
        .then(res => res.json())
        .then(data => {
            weatherCity.innerHTML = `${data.name},${convertContryCode(data.sys.country)}`;
            dateTime.innerHTML = convertTimeStamp(data.dt, data.timezone);
            weatherForcast.innerHTML = `<p>${data.weather[0].main}</p>`;
            weathTemp.innerHTML = `${Math.round(data.main.temp)}&#176`;

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
            feelsLike.innerHTML=`${Math.round(data.main.feels_like)}&#176`;
            humidity.innerHTML=`${Math.round(data.main.humidity)}%`;
            wind.innerHTML=`${data.wind.speed} M/S`;
            pressure.innerHTML=`${Math.round(data.main.pressure)} hpa`;

            console.log(data);
        });
}


document.addEventListener('DOMContentLoaded', getWeather);
