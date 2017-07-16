import { hoverTransition } from '../../../../styles/style-utils';
import { Popup } from 'semantic-ui-react';
import propTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Table from './Table';
import TableRow from './TableRow';

const URL = "https://freecodecamp.org/";

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
  browniePoints,
  currentStreak,
  fccCerts,
  firstChallenge,
  longestStreak,
  totalChallenges,
  username,
  width,
}) => {
  const removeIcon = (
    <i className="large red remove icon" />
  );
  const checkmarkIcon = (
    <i className="large green check mark icon" />
  );
  return (
    <div className="row">
      <Table columnWidth={width}>
        <TableRow
          content={fccCerts.Front_End ? checkmarkIcon : removeIcon }
          header={fccCerts.Front_End
            ? <A
                href={`${URL + username}/front-end-certification`}
                rel="noreferrer noopener"
                target="_blank">
                {'Frontend Certified'}
              </A>
            : "Frontend Certified" }
          icon="desktop" />
        <TableRow
          content={fccCerts.Data_Visualization ? checkmarkIcon : removeIcon }
          header={fccCerts.Data_Visualization
            ? <A
                href={`${URL + username}/data-visualization-certification`}
                rel="noreferrer noopener"
                target="_blank">
              {'Data Visualization Certified'}
              </A>
            : "Data Visualization Certified" }
          icon="bar chart" />
        <TableRow
          content={fccCerts.Back_End ? checkmarkIcon : removeIcon }
          header={fccCerts.Back_End
            ? <A
                href={`${URL + username}/back-end-certification`}
                rel="noreferrer noopener"
                target="_blank">
                {'Backend Certified'}
              </A>
            : "Backend Certified" }
          icon="database" />
        <TableRow
          content={
            <div>
              {totalChallenges}
              <Popup
                content="This value includes the total number of
                all projects, algorithms, and challenges combined."
                inverted
                position="top center"
                trigger={<InfoIcon className="info circle icon" />}
                wide />
            </div> }
          header="Total Challenges Completed"
          icon="tasks" />
      </Table>
      <Table columnWidth={width}>
        <TableRow
          content={firstChallenge}
          header="First Challenge Completed"
          icon="history" />
        <TableRow
          content={longestStreak}
          header="Longest Streak Ever"
          icon="grid layout" />
        <TableRow
          content={currentStreak}
          header="Current Streak"
          icon="block layout" />
        <TableRow
          content={browniePoints}
          header="Total Brownie Points"
          icon="thumbs up" />
      </Table>
    </div>
  );
}

FccTables.propTypes = {
  browniePoints: propTypes.string.isRequired,
  currentStreak: propTypes.string.isRequired,
  fccCerts: propTypes.object.isRequired,
  firstChallenge: propTypes.string.isRequired,
  longestStreak: propTypes.string.isRequired,
  totalChallenges: propTypes.number.isRequired,
  width: propTypes.string.isRequired,
}

export default FccTables;
