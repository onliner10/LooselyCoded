require 'sinatra'
require 'net/http'
require 'json'

get '/' do
  cities = params[:cities]
  citiesAndTemperature = Hash.new

  cities.each { |city| citiesAndTemperature[city] = get_temperature(city) }

  citiesAndTemperature.to_json
end

def get_temperature(city)
	response = Net::HTTP.get_response(URI.parse("http://api.openweathermap.org/data/2.5/forecast?q="+city+"&mode=json")).body

	JSON.parse(response)["list"].first["main"]["temp"].to_f
end