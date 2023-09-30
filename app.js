const wrapper = document.querySelector(".container");
const info = document.querySelector(".info-text");
const searchField = document.querySelector(".input");
const Searchbtn = document.querySelector("#searchButton");
const deviceLocationBtn = document.querySelector(".DeviceLocation");
const cityName = document.querySelector(".city");
const getDate = document.querySelector(".getDate");
const image = document.querySelector(".weather-image");
const temperature = document.querySelector(".temperature");
const descrp = document.querySelector(".description");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind");
const form = document.querySelector("#form");
const arrowBack = document.querySelector(".header i");
const celcius = document.querySelector("#celcius");
const fahrenheit = document.querySelector("#fahrenheit");

const API_KEY = "06983b073bb497e662e5bf5abea41870";
let API_URL;

celcius.checked = true;
let tempCelcius = "";

celcius.addEventListener("click", () => {
    temperature.innerText = Math.floor(tempCelcius) + "°C";
});

fahrenheit.addEventListener("click", () => {
    let temper = tempCelcius * 1.8 + 32;
    temperature.innerText = Math.floor(temper) + "°F";
});
function getDataForLoction(city) {
    API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    fetchData(API_URL);
}

// Fetching Data from OpenWeatherMap API
const fetchData = async (API_URL) => {
    info.innerHTML = "Getting weather details....";
    info.classList.add("pending");

    // handling error while fetching data
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        weatherDetails(result);
    } catch (error) {
        alert("Error in fetching Data , please check your API url/Key.");
    }
};

form.addEventListener("submit", search);
Searchbtn.addEventListener("click", search);

// searching weather updates by cityName
function search(e) {
    e.preventDefault();
    city = searchField.value;
    getDataForLoction(city);
    searchField.value = "";
}

// Use Device Location for fetching weather updates
deviceLocationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser not supported Gelocation Api");
    }
});

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
    fetchData(API_URL);
}

function onError(error) {
    console.log(error);
    info.innerHTML = error.message;
    info.classList.add("error");
}

function weatherDetails(detail) {
    if (detail.cod == "404") {
        info.classList.replace("pending", "error");
        info.innerHTML = detail.message;
    } else {
        const cityName = detail.name;
        const { temp, humidity } = detail.main;
        const { description, id } = detail.weather[0];
        const { speed } = detail.wind;
        const { country } = detail.sys;
        const { dt, timezone } = detail;

        tempCelcius = temp;

        updateDom(
            cityName,
            country,
            temp,
            humidity,
            description,
            id,
            speed,
            dt,
            timezone
        );
        info.classList.remove("pending");
        wrapper.classList.add("active");
    }
}
//Updating Dom
function updateDom(
    city,
    country,
    temp,
    humid,
    description,
    id,
    speed,
    timeStamp,
    timezone,
    unit
) {
    cityName.innerHTML = `${city} , ${country}`;
    getDate.innerHTML = convertTimeStamp(timeStamp, timezone);
    temperature.innerText = Math.floor(temp) + "°C";
    descrp.innerText = description;
    humidity.innerText = ` ${humid} %`;
    windSpeed.innerText = `${speed} m/s`;

    if (id == 800) {
        image.src = "assests/clear.png";
    } else if (id >= 200 && id <= 232) {
        image.src = "assests/storm.png";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
        image.src = "assests/rain.png";
    } else if (id >= 600 && id <= 622) {
        image.src = "assests/snow.png";
    } else if (id >= 701 && id <= 781) {
        image.src = "assests/haze.png";
    } else if (id >= 801 && id <= 804) {
        image.src = "assests/cloud.png";
    }
}

//getting date and time
function convertTimeStamp(timeStamp, timezone) {
    const convertTimeZone = timezone / 3600;
    const date = new Date(timeStamp * 1000);
    return date.toString().substring(0, 24);
}

arrowBack.addEventListener("click", () => {
    celcius.checked = true;
    wrapper.classList.remove("active");
});
