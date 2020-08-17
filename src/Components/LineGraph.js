import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: true,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildGraphdata = (data, caseType) => {
  const chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      const newDataPoint = { x: date, y: data[caseType][date] - lastDataPoint }
      chartData.push(newDataPoint);
    };
    lastDataPoint = data[caseType][date];
  }
  return chartData;
};

const LineGraph = ({ country, timeperiod, caseType, color }) => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=${timeperiod}`)
        .then(response => response.json())
        .then(data => {setData(buildGraphdata(country === 'all' ? data : data.timeline, caseType))})
        .catch(error => {setData([]); alert('Historical data not found for country.\nCannot show the case graph')});
    };
    getData();
  },[country, caseType]);

  return (
    <div className="graph" style={{marginTop: "20px"}}>
      {data?.length > 0 && <Line data={{
        datasets: [
          {
            backgroundFill: color,
            backgroundOpacity: "0.5",
            borderColor: color,
            data: data,
          },
        ],
      }}
      options={options}
      height={250}
      />}
    </div>
  );
}

export default React.memo(LineGraph);