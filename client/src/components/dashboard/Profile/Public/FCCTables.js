import React from 'react';
import Table from './Table';
import styled from 'styled-components';
import TableRow from './TableRow';
import { hoverTransition } from '../../../../styles/globalStyles';

const URL = "https://freeCodeCamp.com/";

const InfoIcon = styled.i `
  font-size: 14px !important;
  margin-left: 4px !important;
  color: grey;
  ${ hoverTransition() }
`;

const A = styled.a`
  ${ hoverTransition() }
`;

const FccTables = ({
  fccCerts,
  username,
  longestStreak,
  currentStreak,
  browniePoints,
  firstChallenge,
  totalChallneges,
}) => {
  return (
    <div className="row">
      <Table>
        <TableRow
          icon="desktop"
          header={ fccCerts.Front_End
            ? <A href={`${URL + username}/front-end-certification`} target="_blank">Frontend Certified</A>
            : "Frontend Certified" }
          content={ fccCerts.Front_End
            ? <i className="large green check mark icon"/>
            : <i className="large red remove icon"/> } />
        <TableRow
          icon="bar chart"
          header={ fccCerts.Data_Visualization
            ? <A href={`${URL + username}/data-visualization-certification`} target="_blank">Data Visualization Certified</A>
            : "Data Visualization Certified" }
          header="Data Visualization Certified"
          content={ fccCerts.Data_Visualization
            ? <i className="large green check mark icon"/>
            : <i className="large red remove icon"/> } />
        <TableRow
          icon="database"
          header={ fccCerts.Back_End
            ? <A href={`${URL + username}/back-end-certification`} target="_blank">Backend Certified</A>
            : "Backend Certified" }
          content={ fccCerts.Back_End
            ? <i className="large green check mark icon"/>
            : <i className="large red remove icon"/> } />
        <TableRow
          icon="tasks"
          header="Total Challenges Completed"
          content={
            <div>
              {totalChallneges}
              <InfoIcon
                className="info circle icon"
                title="This value includes the total number of all projects, algorithms, and challenges combined." />
            </div> } />
      </Table>
      <Table>
        <TableRow
          icon="history"
          header="First Challenge Completed"
          content={firstChallenge} />
        <TableRow
          icon="grid layout"
          header="Longest Streak Ever"
          content={longestStreak} />
        <TableRow
          icon="block layout"
          header="Current Streak"
          content={currentStreak} />
        <TableRow
          icon="thumbs up"
          header="Total Brownie Points"
          content={browniePoints} />
      </Table>
    </div>
  );
}

FccTables.propTypes = {
  fccCerts: React.PropTypes.object.isRequired,
  longestStreak: React.PropTypes.string.isRequired,
  currentStreak: React.PropTypes.string.isRequired,
  browniePoints: React.PropTypes.string.isRequired,
  firstChallenge: React.PropTypes.string.isRequired,
  totalChallneges: React.PropTypes.number.isRequired,
}

export default FccTables;
