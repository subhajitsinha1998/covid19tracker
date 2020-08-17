import React from 'react';
import './Table.css';
import numeral from 'numeral';

const Table = ({ countries, caseType }) => {
  return (
    <div className="table">
      {countries.map(
        (country) =>
          <tr>
            <td>{country.country}</td>
            <td><strong>{numeral(country[caseType]).format("0,0")}</strong></td>
          </tr>
      )}
    </div>
  );
}

export default React.memo(Table);