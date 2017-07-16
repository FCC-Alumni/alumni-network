import React from 'react';
import Table from './Table';
import TableRow from './TableRow';

const CareerRow = ({ career }) => {
  const TableToRender = career.working === "no"
  ? ( <Table columnWidth="sixteen">
        <TableRow
            content={ <i className="large red remove icon" /> }
            header="I am employed as a professional
            or freelance Software Developer" />
        <TableRow
            content={career.jobSearch}
            header="Looking for a programming job?" />
        <TableRow
            content={career.tenure}
            header="I have been coding for:" />
        { career.hasBeenEmployed === 'yes' &&
        <TableRow
          content={career.company}
          header='I have previously worked for:' /> }
      </Table> )
  : ( <Table columnWidth="sixteen">
        <TableRow
            content={ <i className="large green check mark icon" /> }
            header="I am employed as a professional
            or freelance Software Developer" />
        <TableRow
            content={career.tenure}
            header="Total Professional Tenure" />
        <TableRow
            content={career.company}
            header="Companies" />
      </Table> );
  return (
    <div className="row">
      { TableToRender }
    </div>
  );
}

export default CareerRow;
