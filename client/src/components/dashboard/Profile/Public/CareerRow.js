import React from 'react';
import Table from './Table';
import TableRow from './TableRow';

const CareerRow = ({ career }) => {
  const TableToRender = career.working === "no"
    ? <Table columnWidth="sixteen">
        <TableRow
          header="I am employed as a professional or freelance Software Developer"
          content={ <i className="large red remove icon"/> } />
        <TableRow
          header="Looking for a programming job?"
          content={career.jobSearch} />
        <TableRow
          header="I have been coding for:"
          content={career.tenure} />
        {career.hasBeenEmployed === 'yes' &&
          <TableRow
            header='I have previously worked for:'
            content={career.company} />
        }
      </Table>
    : <Table columnWidth="sixteen">
        <TableRow
          header="I am employed as a professional or freelance Software Developer"
          content={ <i className="large green check mark icon"/> } />
        <TableRow
          header="Total Professional Tenure"
          content={career.tenure} />
        <TableRow
          header="Companies"
          content={career.company} />
      </Table>
  return (
    <div className="row">
      { TableToRender }
    </div>
  );
}

export default CareerRow;
