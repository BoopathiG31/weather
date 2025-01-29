import { useEffect, useState } from 'react'
import './App.css'
import PropsTypes from "prop-types";
// Images
import searchIcon from  "./assets/se.jpg"
import clearIcon from  "./assets/clear.jpg"
import cloudIcon from  "./assets/clear.jpg"
import drizzleIcon from  "./assets/clear.jpg"
import rainIcon from  "./assets/rain.jpg"
import snowIcon from  "./assets/snow.jpg"
import windIcon from  "./assets/wind.jpg"
import humidityIcon from  "./assets/th.jpg"


const WeatherDetails = ({icon, temp, city, country, lat, log, humidity, wind}) => {
  return(
    <>
      <div className='image'>
        <img src={icon} alt="Image"/>
      </div>
      <div className="temp">{temp}℃</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className='lat'>latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="" width={25} height={20} className='icon'/>
          <div className="data">
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="" width={25} height={20} className='icon'/>
          <div className="data">
            <div className="wind-percent">{wind}km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
}

WeatherDetails.PropsTypes = {
  icon: PropsTypes.string.isRequired,
  temp: PropsTypes.number.isRequired,
  city: PropsTypes.string.isRequired,
  country: PropsTypes.string.isRequired,
  humidity: PropsTypes.number.isRequired,
  wind: PropsTypes.number.isRequired,
  lat: PropsTypes.number.isRequired,
  log: PropsTypes.number.isRequired,
};

function App() {
  let api_key = "a5f9a82f6b3542f469687eb1e0413518";

  const [text, setText] = useState("london")

  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("london");
  const [country, setCountry] = useState("GB");
  const [lat, setlat] = useState(0);
  const [log, setlog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const[cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false)
  const[error,setError] = useState(null)

  const weatherIconMap = {
    "01d":clearIcon,
    "01n":clearIcon,
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":drizzleIcon,
    "03n":drizzleIcon,
    "04d":drizzleIcon,
    "04n":drizzleIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "10d":rainIcon,
    "10n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon,
  }

  const search = async () => {
    setLoading(true);
    
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
      let res = await fetch(url);
      let data = await res.json();
      // console.log(data)
      if (data.cod === "404") {
        console.log("city not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setlat(data.coord.lat);
      setlog(data.coord.lon)
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false)
      

    }catch(error){
      console.error("An error occurred:", error.message);
      setError("An error occured while fetching weather data.");
    }finally{
      setLoading(false);
    }
  
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if(e.key === "Enter") {
      search()
    }
  }

  useEffect(function () {
    search();
  },[]);


  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" className='cityInput'  placeholder='Search city' onChange={handleCity} value={text} onKeyDown={handleKeyDown}/>
          <div className="search-icon">
            <img src={searchIcon} alt="Search" onClick={ () => search()} />
          </div>
        </div>
        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} 
        lat={lat} log={log} humidity={humidity} wind={wind}/>}

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}
        <p className='copyright'>
          Designed by <span>Boopathi</span>
        </p>
      </div>
    </>
  )
}

export default App
