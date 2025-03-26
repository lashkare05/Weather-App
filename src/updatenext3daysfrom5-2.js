document.addEventListener("DOMContentLoaded", () => {
    // Get all necessary elements from the DOM
    const app = document.querySelector('#weather-app');
    const searchLocationInput = document.querySelector('#location'); // Fix select
    const searchBtn = document.querySelector('#btn');
    const currentLocationBtn = document.querySelector('#currentLocationBtn');
    // const recentSearchBox = document.getElementById("recentSearchBox");
    const recentSearchDropdown = document.getElementById("recentSearchDropdown");

    const temp = document.querySelector('#temp');
    const cityName = document.querySelector('#name');
    const countryName = document.querySelector("#country");
    const time = document.querySelector('#time');
    const date = document.querySelector('#date');

    const icon = document.querySelector('.icon');
    const conditionOutput = document.querySelector('#weatherCondition');
    const wind = document.querySelector("#wind");
    const humidity = document.querySelector("#humidity");


    // 5-day output details all necessary from the DOM 
    const iconOutput_1 = document.querySelector("#img-1");
    const tempOutput_1 = document.querySelector("#temp-1");
    const conditionOutput_1 = document.querySelector("#condition-1");
    const humidityOutput_1 = document.querySelector("#humidity-1");
    const windOutput_1 = document.querySelector("#wind-1");
    const dateOutput_1 = document.querySelector("#date-1");

    const iconOutput_2 = document.querySelector("#img-2");
    const tempOutput_2 = document.querySelector("#temp-2");
    const conditionOutput_2 = document.querySelector("#condition-2");
    const humidityOutput_2 = document.querySelector("#humidity-2");
    const windOutput_2 = document.querySelector("#wind-2");
    const dateOutput_2 = document.querySelector("#date-2");

    const iconOutput_3 = document.querySelector("#img-3");
    const tempOutput_3 = document.querySelector("#temp-3");
    const conditionOutput_3 = document.querySelector("#condition-3");
    const humidityOutput_3 = document.querySelector("#humidity-3");
    const windOutput_3 = document.querySelector("#wind-3");
    const dateOutput_3 = document.querySelector("#date-3");

    const iconOutput_4 = document.querySelector("#img-4");
    const tempOutput_4 = document.querySelector("#temp-4");
    const conditionOutput_4 = document.querySelector("#condition-4");
    const humidityOutput_4 = document.querySelector("#humidity-4");
    const windOutput_4 = document.querySelector("#wind-4");
    const dateOutput_4 = document.querySelector("#date-4");

    const iconOutput_5 = document.querySelector("#img-5");
    const tempOutput_5 = document.querySelector("#temp-5");
    const conditionOutput_5 = document.querySelector("#condition-5");
    const humidityOutput_5 = document.querySelector("#humidity-5");
    const windOutput_5 = document.querySelector("#wind-5");
    const dateOutput_5 = document.querySelector("#date-5");


    // Default city when the page loads
    let cityInput = "New York";

    searchBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        if (searchLocationInput.value.length === 0) {
            alert(" Search Location can not be empty");
            return;
        } 
        
        try {
            cityInput = searchLocationInput.value;
            let data = await fetchWeatherData(cityInput);
            console.log("Received data:", data);
            updateUI(data);
            searchLocationInput.value = "";
            console.log("saving recent searched city to Local Storage");
            storeRecentSearches(cityInput); // saveing recent search city name to localStorage
            loadRecentSearches();
            app.style.opacity = "1";
        }catch(error) {
            console.error("Error details:", error);
            alert('Enter correct city name, city not found.');
            app.style.opacity = "1"; 
        }
        
    });


    //add event Listener for current Location
    currentLocationBtn.addEventListener('click', async function(e){
        e.preventDefault();
        console.log('button clicked!..')
        try {
            let cityInput = await getLatAndLong(); // Fetch Weather Data from your chosen weather API using the retrieved coordinates.
            console.log("Fetching weather data for:", cityInput);
            let data = await fetchWeatherData(cityInput);
            console.log("Received data:", data);
            updateUI(data);
            loadRecentSearches();
        } catch(error) {
            console.error("Error details:", error);
            alert('Your current location is not found, please try again.');
            app.style.opacity = "1";
            // console.log('Error while fetching data for current location.',error.message);
            // throw(error);
                
        }
    
    });

    // Function to get the day of the week from a date
    function dayOfTheWeek(day, month, year) {
        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return weekday[new Date(`${year}-${month}-${day}`).getDay()];
    }

    // function for EXTRACTING AND FORMATTING  DATE AND TIME  FROM  //localtime":"2025-03-13 17:46"
    //  data.location.localtime;  //data.current.localtime contains both date and time. You may need to split them.
    function formatLocalTime(fdate) {
        // Format date and time           
        const y = parseInt(fdate.substr(0, 4));
        const m = parseInt(fdate.substr(5, 2));
        const d = parseInt(fdate.substr(8, 2));
        
        // Extract and format time with AM/PM
        const time24 = fdate.substr(11); // Getting HH:MM (24-hour format)
        let [hours, minutes] = time24.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 24-hour format to 12-hour

        // Format month to short name (Jan, Feb, Mar, etc.)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const shortMonth = monthNames[m - 1]; // Adjust for 0-based index
        
        //FINAL FORMAT OF DATE TIME MONTH
        const formattedTime  = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
        const formattedDate = `${dayOfTheWeek(d, m, y)} ${shortMonth} ${d}`;
        
        return {formattedTime, formattedDate};

    }// format data --> ex: 6:24 AM & Sunday Mar 16

    // Function to fetch and display the weather data by cityName
    async function fetchWeatherData(cityInput) {
        // this url fetch current weather data with 5 days forecast
        // fetch(`https://api.weatherapi.com/v1/current.json?key=3bab7126c9bc478c863100456251203&q=${cityInput}&days=5`) 
        // /**current.json endpoint in your fetch call, which only returns current weather data. To get the forecast data (including the 5-day forecast), you need to use the forecast.json  */
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=3bab7126c9bc478c863100456251203&q=${cityInput}&days=6`);
            if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);
            const fetchedWeatherData = await response.json();
            
            // Validate the response data before returning
            if (!fetchedWeatherData ||!fetchedWeatherData.location || !fetchedWeatherData.current || !fetchedWeatherData.forecast) {
                console.error("Incomplete data received:", data);
                throw new Error("Incomplete weather data.");
            }
            
            return fetchedWeatherData;
        }catch(error) {
            alert('The city you search not found, please try again.');
            app.style.opacity = "1";
            console.log('Error while fetching data',error.message);
            throw(error);
            
        }
    }
    fetchWeatherData();
    // calling fetchWeatherData(); function to see fetched weather data in the console (wasn't necessary to call here);

    // Update the UI with the weather forecast.
    /* Append a default time "00:00" to the forecast date string -->coz the current weather API returns a string with both date and time (like "2025-03-13 17:46"), whereas the forecast API returns just the date (e.g., "2025-03-14"). To make it work, you can append a default time (such as " 00:00") to the forecast date before passing it to your function.*/
    function updateUI(data) {

        console.log("updating forecast to UI");

        // 1. update current UI 
        temp.innerHTML = `${data.current.temp_c} &#176;`;
        cityName.innerHTML = data.location.name;
        countryName.innerHTML = data.location.country;
        icon.src = `https:${data.current.condition.icon}`;
        conditionOutput.innerHTML = data.current.condition.text;

        //accessing Formatted date&time from formatLocalTime(); & displaying on browser screen
        const {formattedTime, formattedDate} = formatLocalTime(data.location.localtime);
        time.innerHTML = formattedTime;
        date.innerHTML = formattedDate;
        wind.innerHTML = `Wind - ${data.current.wind_mph} mph`;
        humidity.innerHTML = `Humidity - ${data.current.humidity}%`;

        // Set background based on time, condition and update text/button color dynamically
        let timeOfDay = data.current.is_day ? "day" : "night";
        let code = data.current.condition.code;
        let textColor = "#fff";  // Default light text
        let buttonBg = "#2196F3"; // Default light blue

        if (code === 1000) { // Sunny / Clear
            app.style.backgroundImage = `url(./Images/${timeOfDay}/clear.jpg)`;
            textColor = timeOfDay === "day" ? "#333" : "#f1f1f1"; 
            buttonBg = timeOfDay === "day" ? "#e5ba92" : "#181e27";
        
        } else if (code === 1003) { // Partly Cloudy
            app.style.backgroundImage = `url(./Images/${timeOfDay}/partly-cloudy.jpg)`;
            textColor = timeOfDay === "day" ? "#303030" : "#ddd";
            buttonBg = timeOfDay === "day" ? "#70a9c" : "#373737";

        } else if ([1006, 1009, 1273, 1276, 1279, 1282].includes(code)) { // Cloudy / Overcast
            app.style.backgroundImage = `url(./Images/${timeOfDay}/cloudy.jpg)`;
            textColor = "#ddd";
            buttonBg = timeOfDay === "day" ? "#decd14" : "#181e27";
         
        } else if ([1030, 1135].includes(code)) { // Mist / Fog
            app.style.backgroundImage = `url(./Images/${timeOfDay}/mist.jpg)`;
            textColor = "#222"; 
            buttonBg = "#95a5a6";

        } else if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) { // Rainy
            app.style.backgroundImage = `url(./Images/${timeOfDay}/rainy.jpg)`;
            textColor = "#fff";
            buttonBg = "#647d75";
        
        } else { // Snowy
            app.style.backgroundImage = `url(./Images/${timeOfDay}/snowy.jpg)`;
            textColor = timeOfDay === "day" ? "#dadbd5" : "#f1f1f1";
            buttonBg = timeOfDay === "day" ? "#4d72aa" : "#4a87a8";
        }
         
        // Apply dynamic styles
        document.body.style.color = textColor;  // Change text color globally
        searchBtn.style.background = buttonBg;  // Change search button color
        currentLocationBtn.style.background = buttonBg;  // Change current location button color
        // Fade in the app
        app.style.opacity = "1";

        
        // 2. update 5-days details of UI
        const forecastElements = [
            { date: dateOutput_1, icon: iconOutput_1, temp: tempOutput_1, condition: conditionOutput_1, wind: windOutput_1, humidity: humidityOutput_1 },
            { date: dateOutput_2, icon: iconOutput_2, temp: tempOutput_2, condition: conditionOutput_2, wind: windOutput_2, humidity: humidityOutput_2 },
            { date: dateOutput_3, icon: iconOutput_3, temp: tempOutput_3, condition: conditionOutput_3, wind: windOutput_3, humidity: humidityOutput_3 },
            { date: dateOutput_4, icon: iconOutput_4, temp: tempOutput_4, condition: conditionOutput_4, wind: windOutput_4, humidity: humidityOutput_4 },
            { date: dateOutput_5, icon: iconOutput_5, temp: tempOutput_5, condition: conditionOutput_5, wind: windOutput_5, humidity: humidityOutput_5 },
        ];
        const forecastDays = data.forecast.forecastday.slice(1); // Skip today's forecast
        forecastDays.forEach((dayData, index) => {
            if (index < forecastElements.length) {
                const forecastDateTime = dayData.date + " 00:00"; // Append default time
                const { formattedDate } = formatLocalTime(forecastDateTime);
        
                forecastElements[index].date.innerHTML = formattedDate;
                forecastElements[index].icon.src = `https:${dayData.day.condition.icon}`;
                forecastElements[index].temp.innerText = ` ${Math.trunc(dayData.day.maxtemp_c)}°/${Math.trunc(dayData.day.mintemp_c)}°`;
                forecastElements[index].condition.innerText = dayData.day.condition.text;
                forecastElements[index].wind.innerText = `Wind: ${dayData.day.maxwind_mph} mph`;
                forecastElements[index].humidity.innerText = `Humidity: ${dayData.day.avghumidity}%`;
            }
        });


    }

    /* Using the Geolocation API to retrieve the user's latitude and longitude. 
    this getLatAndLong() returns the lattitude and longitude of the current location */
    function getLatAndLong() {
        return new Promise((resolve,reject) => {
            // checking if Geolocation is supported 
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    resolve(`${latitude},${longitude}`);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    reject(new Error("Unable to retrieve your location. Please check location permissions."));
                
                }
            );
            } else {
                // reject("Geolocation is not supported by this browser.");
                reject(new Error("Geolocation is not supported by this browser."));

            }
            
        });
    } 

    // storing recently searched cities in local storage while maintaining a limit of 5 cities.
    // Store recent searches in local storage
    function storeRecentSearches(cityInput) {
        let cities = JSON.parse(localStorage.getItem("recentSearchedCities")) || []; //localStorage only stores strings, JSON.parse() converts it back into an array.
        if (!cities.includes(cityInput)) {
            cities.unshift(cityInput); // Add to the beginning
            if (cities.length > 5) cities.pop(); // Limit to 5 recent searches
            localStorage.setItem("recentSearchedCities", JSON.stringify(cities));  // converting to a string using JSON.stringify()
        }
    }

    // accessing recent searches from local storage
    function loadRecentSearches() {
        const cities = JSON.parse(localStorage.getItem("recentSearchedCities")) || [];
        recentSearchDropdown.innerHTML = ""; // Clear previous items
    
        if (cities.length === 0) {
            recentSearchDropdown.classList.add("hidden");
            return;
        }
    
        cities.forEach(cityInput => {
            const li = document.createElement("li");
            // // li.textContent = cityInput.split('').map((char,index) => index === 0 ? char.toUpperCase() : char).join(''); or
            // li.textContent = cityInput[0].toUpperCase() + cityInput.slice(1).join('');
            li.textContent = cityInput;
            // Added transition classes for a smoother hover effect
            li.className = "p-2 hover:bg-gray-300 cursor-pointer transition-colors duration-200 capitalize";
            li.addEventListener("click", async () => {
                searchLocationInput.value = cityInput;
                let data = await fetchWeatherData(cityInput);
                console.log("-------------------",data);
                fetchWeatherData(data);
                updateUI(data);
            });
            recentSearchDropdown.appendChild(li);
        });
        
        recentSearchDropdown.classList.remove("hidden");
    }
    
    // Load default city forecast on page load
    window.onload = async function () {
    try {
        await loadRecentSearches();  // Load previous searches
        let data = await fetchWeatherData(cityInput); // Fetch default city weather
        updateUI(data);
        app.style.opacity = "1";
    } catch (error) {
        console.error("Error loading default city weather:", error);
    }
};


});






