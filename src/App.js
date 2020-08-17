import React, { useState, useEffect } from 'react';
import './App.css';
import { FormControl, Select, MenuItem, Card, CardContent, CircularProgress } from '@material-ui/core'
import Infobox from './Components/InfoBoxes';
import Map from './Components/Map';
import Table from './Components/Table';
import LineGraph from './Components/LineGraph';
import 'leaflet/dist/leaflet.css';
import numeral from 'numeral';

const App = () => {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('all');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 45, lng: 0 });
  const [mapZoom, setMapZoom] = useState(2);
  const [caseType, setCaseType] = useState('cases')
  const casesTypeColors = {cases: "blue", recovered: "green", deaths: "red"};

  const sortByCases = (data, caseType) => data.sort((a, b) => a[caseType] > b[caseType] ? -1 : 1);
  const prettyPrintStat = stat => stat ? `+${numeral(stat).format("0.0a")}` : "+0";

  useEffect(() => {
    setIsLoading(true);
    const getInitialData = async () => {
      await fetch('https://disease.sh/v3/covid-19/all')
        .then(response => response.json())
        .then(data => setCountryInfo(data))
        .catch(error => alert(`Some error occured!!!\n${error}`));
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(request => request.json())
        .then(data => {
          setCountries(data);
          setTableData(data.map(country => ({ country: country.country, cases: country.cases, recovered: country.recovered, deaths: country.deaths })));
        })
    }
    getInitialData();
    setIsLoading(false);
  }, []);

  const onCountryChange = async event => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = countryCode === 'all' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    const zoom = countryCode === 'all' ? 2 : 4;
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        const center = countryCode === 'all' ? { lat: 45, lng: 0 } : { lat: data.countryInfo.lat, lng: data.countryInfo.long };
        setCountryInfo(data);
        setMapCenter(center);
        setMapZoom(zoom);
      })
      .catch(error => alert('Check internet and try again.'));
  };

  return (
    <div className="app">
      {isloading ? <CircularProgress /> :
        <>
          <div className="app__main">
            <div className="app__header">
              <h1>COVID-19 TRACKER</h1>
              <FormControl className="app__dropdown">
                <Select variant="outlined" value={country} onChange={onCountryChange}>
                  <MenuItem key="0" value="all">Worldwide</MenuItem>
                  {countries.map((country, index) => <MenuItem key={index} value={country.countryInfo.iso2}>{country.country}</MenuItem>)}
                </Select>
              </FormControl>
            </div>
            <div className="app__stats">
              <Infobox tittle="Coronavirus cases" newcases={prettyPrintStat(countryInfo.todayCases)} totalcases={prettyPrintStat(countryInfo.cases)} boxType={casesTypeColors.cases} isActive={caseType==='cases'} onClick={event => setCaseType('cases')} />
              <Infobox tittle="Recovered" newcases={prettyPrintStat(countryInfo.todayRecovered)} totalcases={prettyPrintStat(countryInfo.recovered)} boxType={casesTypeColors.recovered} isActive={caseType==='recovered'} onClick={event => setCaseType('recovered')} />
              <Infobox tittle="Deaths" newcases={prettyPrintStat(countryInfo.todayDeaths)} totalcases={prettyPrintStat(countryInfo.deaths)} boxType={casesTypeColors.deaths} isActive={caseType==='deaths'} onClick={event => setCaseType('deaths')} />
            </div>
            <Map data={countries} center={mapCenter} zoom={mapZoom} caseType={caseType} color={casesTypeColors[caseType]} />
          </div>
          <div className="app__sidebar">
            <Card>
              <CardContent>
                <h3>Country wise {caseType}</h3>
                <Table countries={sortByCases(tableData, caseType)} caseType={caseType} />
                <h3>New {caseType} in last 4 months</h3>
                <LineGraph country={country} timeperiod={120} caseType={caseType} color={casesTypeColors[caseType]} />
              </CardContent>
            </Card>
          </div>
        </>
      }
    </div>
  );
}

export default App;