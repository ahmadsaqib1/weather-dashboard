$(document).ready(function () {
  //API key
  let apiKey = "821a77b093022d4475b0fe9635fe2d9b";

  //Max number of cities in searched history
  let maxHistorySize = 7;

  //HTML element selectors
  let searchForm = $("#search-form");
  let searchInput = $("#search-input");
  let historyList = $("#history");

  searchForm.on("submit", function (event) {
    event.preventDefault();

    let cityName = searchInput.val().trim();

    if (cityName !== "") {
      getWeatherData(cityName);
    }
  });

  function getWeatherData(cityName) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    $.ajax({
      url: apiUrl,
      method: "GET",
      success: function (data) {
        displayWeather(data);
        addToHistory(cityName);
        getForecast(cityName);
      },
      error: function (error) {
        console.error("Error fetching weather data:", error);
      },
    });
  }

  function getForecast(cityName) {
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    $.ajax({
      url: forecastUrl,
      method: "GET",
      success: function (data) {
        displayForecast(data.list);
      },
      error: function (error) {
        console.error("Error fetching forecast data:", error);
      },
    });
  }

  //display 5 days weather forecast
  function displayForecast(forecastList) {
    let forecastRow = $(".forecast-row");
    forecastRow.html(""); // Clear previous forecast

    for (let i = 0; i < forecastList.length; i += 8) {
      let forecast = forecastList[i];
      let card = $("<div>").addClass("card");

      let dateElement = $("<h2>").text(
        dayjs(forecast.dt_txt).format("DD/MM/YYYY")
      );
      let iconElement = $("<img>")
        .addClass("fiveDay-img mb-2")
        .attr(
          "src",
          `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`
        );
      let tempElement = $("<p>").text(`Temp: ${forecast.main.temp}°C`);
      let windElement = $("<p>").text(`Wind: ${forecast.wind.speed} KPH`);
      let humidityElement = $("<p>").text(
        `Humidity: ${forecast.main.humidity}%`
      );

      card.append(
        dateElement,
        iconElement,
        tempElement,
        windElement,
        humidityElement
      );
      forecastRow.append(card);
    }
  }

  function displayWeather(data) {
    let cityElement = $("#city");
    let dateElement = $("#date");
    let iconElement = $("#weather-icon");
    let tempElement = $("#temp");
    let windElement = $("#wind");
    let humidityElement = $("#humidity");

    // Use dayjs to format the date
    let formattedDate = `(${dayjs().format("DD/MM/YYYY")})`;

    // Concatenate city name and formatted date with a space in between
    let cityAndDate = `${data.name} ${formattedDate}`;

    cityElement.text(cityAndDate);
    iconElement.attr(
      "src",
      `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    );
    tempElement.text(`Temp: ${data.main.temp}°C`);
    windElement.text(`Wind: ${data.wind.speed} KPH`);
    humidityElement.text(`Humidity: ${data.main.humidity}%`);
  }

  function addToHistory(cityName) {
    let historyArray = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    // Check if the city is already in the history
    if (!historyArray.includes(cityName)) {
      // Remove the oldest entry if the history size exceeds maxHistorySize
      if (historyArray.length >= maxHistorySize) {
        historyArray.shift();
      }

      // new entry to the history array
      historyArray.push(cityName);

      // Save the updated history array
      localStorage.setItem("weatherHistory", JSON.stringify(historyArray));

      // Update the history list
      updateHistoryList(historyArray);

      // Update the placeholder in the search input with the selected city
      searchInput.attr("placeholder", data.name);
    }
  }

  function updateHistoryList(historyArray) {
    historyList.html(""); // Clear previous history

    historyArray.forEach(function (cityName) {
      let listItem = $("<a>")
        .attr("href", "#")
        .addClass("list-group-item list-group-item-action")
        .text(cityName)
        .on("click", function () {
          getWeatherData(cityName);
        });

      historyList.append(listItem);
    });
  }

  // Initial load: Retrieve and display London's weather and forecast by default
  let defaultCity = "London";
  getWeatherData(defaultCity);

  // Initial load: Retrieve and display the history from local storage
  let initialHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  updateHistoryList(initialHistory);
});
