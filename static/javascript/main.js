//state
let city="London";
let units="metric";

//selectors
let searchCity = document.querySelector(".weatherCity");
let dateTime = document.querySelector(".dateTime"); 
let weatherForcast=document.querySelector(".weather");


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
            searchCity.innerHTML=`${data.name},${convertContryCode(data.sys.country)}`;
            dateTime.innerHTML= convertTimeStamp(data.dt,data.timezone);
            weatherForcast.innerHTML=` <p>${data.weather[0].main}</p>`;

        });
}


document.addEventListener('DOMContentLoaded', getWeather);

