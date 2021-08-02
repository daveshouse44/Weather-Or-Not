    
// Gets API values for city searched
var getApi = function(city) {
        
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=d7a11f2d002ad68c2717375f3d4e253a";
        
    fetch(apiUrl)
        .then(function (response){
            if (response.ok) {
            //console.log(response);
            response.json().then(function (data) {
                console.log(data);
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

        if (cityVal === ""){
            alert("Please enter a city");
            return
        }
         
        listHistory.appendTo(".history");
        getApi(cityVal);
        localStorage.getItem(cityVal);
        localStorage.setItem(listHistory, cityVal);
        document.getElementById("city-search").value = "";
});

// To run API for the saved cities on list
$(".history").on("click", function (event) {
    console.log(event.target.getAttribute("data-city"));
    var histSearch = event.target;
    var search = histSearch.getAttribute("data-city");
    getApi(search);
});