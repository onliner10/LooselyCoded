var http = require('http');

var server = http.createServer(function (req, res) {
	var query = require('url').parse(req.url,true).query;
	var cities = [];
	var query = query.city;
	
	if(typeof query == "string") {
		cities.push(query);
	} 
	else {
		cities = query;
	}

	var processedCities = 0;
	var citiesAndTemperature = {};
	cities.forEach(function(city) {
		getTemperature(city, function(temperature) {
			citiesAndTemperature[city] = temperature;
			processedCities++;
			if(processedCities == cities.length) {
				res.writeHead(200, {"Content-Type": "application/json"});
				res.end(JSON.stringify(citiesAndTemperature));
			}
		});
	}); 
});

server.listen(8000);

console.log("Server running at http://127.0.0.1:8000/");

function getTemperature(city, callback) {

	var options = {
		host: 'api.openweathermap.org',
		path: '/data/2.5/forecast?q=' + city + '&mode=json'
	};

	http.request(options, function(res) {
		var apiResult = '';

	  res.on('data', function (chunk) {
	  	apiResult += chunk;
	  });

	  res.on('end', function () {
	  	var forecast = JSON.parse(apiResult);
	  	var temperature = forecast.list[0].main.temp;

	  	callback(temperature);
	  });
	}).end();


}