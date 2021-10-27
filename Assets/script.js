const cityDisp = $("#cityDisp");
const tempDisp = $("#tempDisp");
const windDisp = $("#windSpeedDisp");
const uvDisp = $("#uvIDisp");
const humidDisp = $("#humidDisp");

var citiesSearched = JSON.parse(localStorage.getItem("citiesSearch")) || [];

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

          // const forcast = data.daily;
          // forcast.forEach((element) => {
          //   displayForcast(element);
          // });
        });
    });
}
// Submits search value
$("#citySelect").on("click", function (event) {
  event.preventDefault(event);

  var cityVal = $("#city-search").val();

  if (cityVal === "") {
    alert("Please enter a city");
    return;
  } else {
    $("#city-search").val("");
    getWeatherData(cityVal);
    //setHistory(userInput);
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
  //$("#cityHistory").empty();
  // console.log(name, temp, humid, icon, wind, uv);
  const title = $("<h2>");
  const dispTemp = $("<p>");
  const dispHumid = $("<p>");
  const dispIcon = $("<img>");
  const dispWind = $("<p>");
  const dispUV = $("<p>");
  const span = $("<span>");

  let date = new Date().toLocaleDateString();
  

  title.text(name +" "+ date);
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

function displayForcast(data){

}

//   var date = moment(new Date(data.dt * 1000)).format("MM/DD/YYYY");
//   var temperature = Math.round(parseFloat(data.main.temp));
//   var humidity = data.main.humidity;
//   var windspeed = data.wind.speed;
//   var icon =
//     "<img src=https://openweathermap.org/img/wn/" +
//     data.weather[0].icon +
//     "@2x.png>";

//   document.getElementById("cityDisp").innerHTML =
//     data.name + "" + date + "" + icon;
//   document.getElementById("tempDisp").innerHTML =
//     "Temperature: " + temperature + "F&deg;";
//   document.getElementById("humidDisp").innerHTML =
//     "Humidity: " + humidity + "%";
//   document.getElementById("windSpeedDisp").innerHTML =
//     "Wind Speed: " + windspeed + "MPH";
// }

// To run API for the saved cities on list
$(".list").on("click", function (event) {
  console.log(event.target.getAttribute("city-data"));
  var histSearch = event.target;
  var search = histSearch.getAttribute("city-data");
  getApi(search);
});
