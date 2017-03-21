const convertMonthToString = (year, month) => {
  switch (month) {
    case '01':
      return 'Jan ' + year;
    case '02':
      return 'Feb ' + year;
    case '03':
      return 'Mar ' + year;
    case '04':
      return 'Apr ' + year;
    case '05':
      return 'May ' + year;
    case '06':
      return 'Jun ' + year;
    case '07':
      return 'Jul ' + year;
    case '08':
      return 'Aug ' + year;
    case '09':
      return 'Sep ' + year;
    case '10':
      return 'Oct ' + year;
    case '11':
      return 'Nov ' + year;
    case '12':
      return 'Dec ' + year;
    default:
      return '';
  }
}

export default convertMonthToString;
