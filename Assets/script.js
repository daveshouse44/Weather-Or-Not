var citiesSearch = JSON.parse(localStorage.getItem("citiesSearch")) || [];   
// Gets API values for city searched
var getApi = function(city) {
        
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=d7a11f2d002ad68c2717375f3d4e253a";
        
    fetch(apiUrl)
        .then(function (response){
            if (response.ok) {
            //console.log(response);
            response.json().then(function (data) {
                console.log(data);
                
                getWeatherData(data.coord.lat,data.coord.lon);
            });
        } else {
            alert("Enter a city to search!");
        }
        
        });
    };


// Captures city names and saves to history card
$(".btn").click(function(event){
    event.preventDefault();

        var cityVal = ($("#city-search").val());
        var listHistory = $('<li>').attr("data-city", cityVal).text(cityVal);
        console.log(listHistory);

        if (cityVal === ""){
            alert("Please enter a city");
            return
        }
         
        listHistory.appendTo(".history");
        getApi(cityVal);

        // Save in local storage
        citiesSearch.push(cityVal);
        localStorage.setItem("citiesSearch", JSON.stringify(citiesSearch));
        
        // Clears search bar
        document.getElementById("city-search").value = "";
});

// Calls API for lat and long to get forcast data
function getWeatherData(latitude, longitude) {
    var apiUrl ="https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=alerts,hourly,minutely&units=imperial&appid=d7a11f2d002ad68c2717375f3d4e253a"

    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            dispCityWeather(data);
            //forecastWeather(data);
            })}
})}

// Shows card for searched city
function dispCityWeather(data) {
    $('#cityHistory').empty()
    
    var date =moment(new Date(data.dt*1000)).format("MM/DD/YYYY");
    var temperature =Math.round(((parseFloat(data.main.temp))));
    var humidity =data.main.humidity;
    var windspeed =data.wind.speed;
    var icon ='<img src=https://openweathermap.org/img/wn/'+data.weather[0].icon+'@2x.png>';

    document.getElementById("cityDisp").innerHTML = data.name + "" + date + "" + icon;
    document.getElementById("tempDisp").innerHTML = "Temperature: " + temperature + "F&deg;";
    document.getElementById("humidDisp").innerHTML = "Humidity: " + humidity + "%";
    document.getElementById("windSpeedDisp").innerHTML = "Wind Speed: " + windspeed + "MPH";

}

// To run API for the saved cities on list
$(".history").on("click", function (event) {
    console.log(event.target.getAttribute("data-city"));
    var histSearch = event.target;
    var search = histSearch.getAttribute("data-city");
    getApi(search);
});