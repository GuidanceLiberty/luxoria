export const resolveRatings = (rating) => {
    let rate;
    switch (parseInt(rating)) {
        case 1:
            rate = [1];
        break;
        case 2:
            rate = [1, 2];
        break;
        case 3:
            rate = [1, 2, 3];
        break;
        case 4:
            rate = [1, 2, 3, 4];
        break;
        case 5:
            rate = [1, 2, 3, 4, 5];
        break;
    
        default:
            break;
    }
    return rate;
}




//FUNCTION TO RESOLVE DATE
export function resolveDate(date_string, type) {
  let year = date_string?.substring(0, 4);
  let mon = date_string?.substring(5, 7);
  let day = date_string?.substring(8, 10);

  // console.log("Month ", day, mon, year);

  let month;
  if (mon === '01') { month = 'Jan' }
  else if (mon === '02') { month = 'Feb' }
  else if (mon === '03') { month = 'Mar' }
  else if (mon === '04') { month = 'Apr' }
  else if (mon === '05') { month = 'May' }
  else if (mon === '06') { month = 'Jun' }
  else if (mon === '07') { month = 'Jul' }
  else if (mon === '08') { month = 'Aug' }
  else if (mon === '09') { month = 'Sep' }
  else if (mon === '10') { month = 'Oct' }
  else if (mon === '11') { month = 'Nov' }
  else if (mon === '12') { month = 'Dec' }

  if (type === 'year') {
    return day + ', ' + month + ' ' + year;
  }
  return day + ', ' + month;
}
