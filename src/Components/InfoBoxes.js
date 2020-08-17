import React from 'react';
import { Card, Typography, CardContent } from '@material-ui/core';
import './InfoBoxes.css';

const InfoBoxes = ({ tittle, newcases, totalcases, boxType, isActive, ...props }) => {
  return (
    <Card onClick={props.onClick} className={`infoBox ${boxType} ${isActive && `infoBox--selected--${boxType}`}`}>
      <CardContent>
        <Typography className={`infoBox__tittle`} color="textSecondary">{tittle}</Typography>
        <h2 className={`infoBox__cases`}>{newcases}</h2>
        <Typography className={`infoBox__total`} color="textSecondary">{totalcases} total</Typography>
      </CardContent>
    </Card>
  )
}

export default InfoBoxes;