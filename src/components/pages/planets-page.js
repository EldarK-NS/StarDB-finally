import React, { Component } from 'react';
import { PlanetList } from '../sw-components';
import { withRouter } from 'react-router-dom'
const PlanetsPage = ({ history }) => {

  return (
    <PlanetList onItemSelected={(itemId) => {
      const newPath = `/planets/${itemId}`;
      history.push(newPath)
    }} />

  );
}
export default withRouter(PlanetsPage);

