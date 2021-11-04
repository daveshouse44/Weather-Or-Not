const cityDisp = $("#cityDisp");
const tempDisp = $("#tempDisp");
const windDisp = $("#windSpeedDisp");
const uvDisp = $("#uvIDisp");
const humidDisp = $("#humidDisp");
const forecastContainer = $("#forecast");
const historyContainer = $('#history');

// Gets all API values for city searched
function getWeatherData(userInput) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=d7a11f2d002ad68c2717375f3d4e253a`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      //console.log(data)
      const temp = data.main.temp;
      const humid = data.main.humidity;
      const icon = data.weather[0].icon;
      const wind = data.wind.speed;
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      const name = data.name;

      let apiUvUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=alerts,hourly,minutely&units=imperial&appid=d7a11f2d002ad68c2717375f3d4e253a`;
      fetch(apiUvUrl)
        //console.log(response);
        .then((response) => response.json())
        .then((data) => {
          const uv = data.current.uvi;
          dispCityWeather(name, temp, humid, icon, wind, uv);

          const forecast = data.daily;
          console.log(forecast);
          forecast.forEach((element) => {
            displayForecast(element);
          });
        });
    });
}
// Submits search value
$("#citySelect").on("click", function (event) {
  event.preventDefault(event);

  var cityVal = $("#city-search").val();

  if (cityVal == "") {
    alert("Please enter a city");
    return;
  } else {
    $("#city-search").val("");
    getWeatherData(cityVal);
    setHistory(cityVal);
    $(".empty").empty();
  }
});

// Shows card for searched city
function dispCityWeather(name, temp, humid, icon, wind, uv) {
  if (uv >= 6) {
    var severity = "bg-danger";
  } else if (uv <= 2) {
    var severity = "bg-success";
  } else {
    var severity = "bg-warning";
  }

  const title = $("<h2>");
  const dispTemp = $("<p>");
  const dispHumid = $("<p>");
  const dispIcon = $("<img>");
  const dispWind = $("<p>");
  const dispUV = $("<p>");
  const span = $("<span>");

  let date = new Date().toLocaleDateString();

  title.text(name + " " + date);
  title.addClass("center");
  dispIcon.attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);
  cityDisp.addClass("bg-info");

  dispTemp.text(`Temperature: ${temp}`);
  dispTemp.addClass("fw-bold");

  dispHumid.text(`Humidity: ${humid}`);
  dispHumid.addClass("fw-bold");

  dispWind.text(`Windspeed: ${wind}`);
  dispWind.addClass("fw-bold");

  dispUV.text(`UV: `);
  dispUV.addClass("fw-bold");

  span.addClass(severity);
  span.addClass("fw-bolder");
  span.text(`${uv}`);

  cityDisp.append(title);
  cityDisp.append(dispIcon);
  tempDisp.append(dispTemp);
  humidDisp.append(dispHumid);
  windDisp.append(dispWind);
  uvDisp.append(dispUV);
  uvDisp.append(span);
}

// Generates forecast cards
function displayForecast(data) {
  const cardDisp = $("<div>");
  const forecastDisp = $("<div>");
  const dispDate = $("<h4>");
  const dispIcon = $("<img>");
  const dispTemp = $("<p>");
  const dispHumid = $("<p>");
  const dispWind = $("<p>");
  var date = new Date(data.dt * 1000).toLocaleDateString();

  cardDisp.addClass("card");
  forecastDisp.addClass("card-body bg-primary");

  dispDate.addClass("card-title text-white");
  dispDate.text(date);

  dispIcon.attr(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  );

  dispTemp.addClass("card-text text-white");
  dispTemp.text(`Temp: ${data.temp.max}`);

  dispHumid.addClass("card-text text-white");
  dispHumid.text(`Humidity: ${data.humidity}`);

  dispWind.addClass("card-text text-white");
  dispWind.text(`Wind: ${data.wind_speed}`);

  forecastContainer.append(cardDisp);
  cardDisp.append(forecastDisp);
  // forecastDisp.append(date);
  forecastDisp.append(dispDate);
  forecastDisp.append(dispIcon);
  forecastDisp.append(dispTemp);
  forecastDisp.append(dispHumid);
  forecastDisp.append(dispWind);
}

// Setting searched city to history list and saving to local storage
function setHistory(data) {
  var cities = [];
  var newCity = [];

  var getCity = data;

  cities = JSON.parse(localStorage.getItem("cityHistory")) || [];
  cities.push(getCity);

  $.each(cities, function (index, element) {
    if ($.inArray(element, newCity) === -1) newCity.push(element);
  });
  localStorage.setItem("cityHistory", JSON.stringify(newCity));
  getHistory();
}

// Getting history
function getHistory() {
  var getData = localStorage.getItem("cityHistory");
  var historySearch = JSON.parse(getData);
  $("#history").empty();

  for (let i = 0; i < historySearch.length; i++) {
    var city = historySearch[i];
    if (city);
    createHistory(city);
  }
}

function createHistory(response) {
  const btn = $("<button>");
  const btnClass = "btn btn-outline-dark card-body";

  btn.attr("type", "button");
  btn.addClass(btnClass);
  btn.text(response);
  historyContainer.append(btn);
}

// Function to clear history and local storage
$("#clear").on("click", (event) => {
  $("#history").empty();
  $(".empty").empty();
  localStorage.clear();
});

getHistory();

// To run API for the saved cities on list
$(document).on('click','.card-body',function() {
  const history = $(this).text();
  console.log(history)
  getWeatherData(history);
  $(".empty").empty();
})
