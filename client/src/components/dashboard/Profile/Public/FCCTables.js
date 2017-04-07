import React from 'react';
import Table from './Table';
import styled from 'styled-components';
import TableRow from './TableRow';

const InfoIcon = styled.i `
  font-size: 14px !important;
  margin-left: 4px !important;
  transition: color 100ms ease-in-out;
  cursor: pointer;
  color: grey;
  &:hover {
    color: #21ba45;
    transition: color 100ms ease-in-out;
  }
`;

const FccTables = ({
  fccCerts,
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
          header="Frontend Certtified"
          content={ fccCerts.Front_End
            ? <i className="large green check mark icon"/>
            : <i className="large red remove icon"/> } />
        <TableRow
          icon="bar chart"
          header="Data Visualization Certtified"
          content={ fccCerts.Data_Visualization
            ? <i className="large green check mark icon"/>
            : <i className="large red remove icon"/> } />
        <TableRow
          icon="database"
          header="Backend Certtified"
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
