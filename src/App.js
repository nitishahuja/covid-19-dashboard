import React, { useEffect, useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import Map from "./Map.js";
import InfoBox from "./InfoBox.js";
import LineGraph from "./LineGraph.js";
import Table from "./Table.js";
import { sortData } from "./util.js";
import "leaflet/dist/leaflet.css";
import "./App.css";

// https://disease.sh/v3/covid-19/countries

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: 74.006 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  // State = how to write a variable in react

  // UseEffect = runs a peice of code based on the give condition

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        // All of the data from the country
        setCountryInfo(data);
        // setMapCountries(data.countryInfo.)
      });
  }, []);

  useEffect(() => {
    // It will run once the app loads or the countries component changes
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };
    getCountryData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    setCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        if (countryCode === "worldwide") {
          setMapCenter([40.7128, 4.006]);
          setMapZoom(2);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4 );
        }
      });
  };
  // console.log(countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        {/* Header */}
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          {/* Tilte and Select Input dropdown feild */}
          {/* OR */}
          {/* Tilte and Filters */}
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              {/* Loop through all the countries and show an drop down list of the options */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />

          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />

          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
          {/* Info boxes title = Coronovirus cases*/}
          {/* Info boxes title = Coronovirus recoveries*/}
          {/* Info boxes title = Coronovirus deaths*/}
        </div>
        {/* Map */}
        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} />
        {/* OR */}
        {/* Graph */}
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          {/* Table */}
          <Table countries={tableData} />
          <h3>Worldwide New Cases</h3>
          <LineGaph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
